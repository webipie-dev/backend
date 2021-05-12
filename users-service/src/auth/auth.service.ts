import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { RefreshToken } from './schemas/refresh-token.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { v4 } from 'uuid';
import { getClientIp } from 'request-ip';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(userId: string) {
    return await this.jwtService.signAsync({ userId });
  }

  async createRefreshToken(req: Request, userId: string) {
    const refreshToken = new this.refreshTokenModel({
      userId,
      refreshToken: v4(),
      ip: this.getIp(req),
      browser: this.getBrowserInfo(req),
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  async findRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.userId;
  }

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne(
      { _id: jwtPayload.userId },
      '+password',
    );
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  getIp(req: Request): string {
    return getClientIp(req);
  }

  getBrowserInfo(req: Request): string {
    return req.header('user-agent') || 'XX';
  }

  private static jwtExtractor(request) {
    let token = null;
    if (request.header('x-token')) {
      token = request.get('x-token');
    } else if (request.headers.authorization) {
      token = request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.body.token) {
      token = request.body.token.replace(' ', '');
    }
    if (request.query.token) {
      token = request.body.token.replace(' ', '');
    }
    return token;
  }

  returnJwtExtractor() {
    return AuthService.jwtExtractor;
  }
}
