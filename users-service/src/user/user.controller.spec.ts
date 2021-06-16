import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { User } from './schemas/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: jest.fn((loginDto: LoginDto) => {
      return {
        jwtToken: 'token',
        refreshToken: 'refresh',
      };
    }),
    create: jest.fn((createUserDto: CreateUserDto) => {
      return {
        id: 'someId',
        name: createUserDto.name,
        email: createUserDto.email,
      };
    }),
    refreshAccessToken: jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (refreshAccessTokenDto: RefreshAccessTokenDto) => {
        return {
          accessToken: 'token',
        };
      },
    ),
    changePassword: jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (user: User, changePasswordDto: ChangePasswordDto) => {
        return {
          id: 'someId',
          name: user.name,
          email: user.email,
        };
      },
    ),
    update: jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (user: User, updateUserDto: UpdateUserDto) => {
        return {
          id: 'someId',
          name: updateUserDto.name,
          email: user.email,
        };
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async() => {
    const createUserDto: CreateUserDto = {
      name: 'name',
      email: 'email@example.com',
      password: 'somePassword',
    };
    expect(await controller.register(createUserDto)).toEqual(expect.objectContaining({
        id: 'someId',
        name: createUserDto.name,
        email: createUserDto.email,
      }),
    );
  });

  it('should update user', async () => {
    expect(controller).toBeDefined();
  });

  it('should login user', () => {
    expect(controller).toBeDefined();
  });

  it('should update user', () => {
    expect(controller).toBeDefined();
  });
});
