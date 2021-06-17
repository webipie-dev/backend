import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(createUserDto.email);
    return await user.save();
  }

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Email must be unique.');
    }
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async login(req: Request, loginDto: LoginDto) {
    const user = await this.findByMail(loginDto.email);
    await this.checkPassword(loginDto.password, user.password);
    return {
      jwtToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Bad request');
    }
    return {
      accessToken: await this.authService.createAccessToken(user._id),
    };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    await this.checkPassword(changePasswordDto.currentPassword, user.password);
    user.password = changePasswordDto.newPassword;
    return await user.save();
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    user.name = updateUserDto.name;
    return await user.save();
  }

  async checkPassword(password: string, hashPassword: string) {
    const match = await bcrypt.compare(password, hashPassword);
    if (!match) {
      throw new UnauthorizedException('Wrong email or password.');
    }
  }

  async findByMail(email: string) {
    const user = await this.userModel.findOne({ email }, '+password').exec();
    if (!user) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    return user;
  }
}
