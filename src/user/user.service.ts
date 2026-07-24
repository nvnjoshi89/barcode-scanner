import { Injectable } from '@nestjs/common';
import { IUserService } from './user.service.interface';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HeaderDto } from '@/common/dto/headers.dto';
import { BadRequestException } from '@/common/exception/bad-request.exception';
import { comparePassword, hashPassword } from '@/common/utils/bcrypt.util';
import { plainToInstance } from 'class-transformer';
import { ResourceNotFoundException } from '@/common/exception/resource-not-found.exception';
import { LoginUserDto } from './dto/login-user.dto';
import { generateToken } from '@/common/utils/jwt';

@Injectable()
export class UserService implements IUserService {
  authServiceUrl: string;
  hmacSecret: string;
  constructor(private readonly userRepository: UserRepository) {}

  async signupUser(data: CreateUserDto): Promise<any> {
    const userExists = this.checkUserExists(data.email);
    if (userExists) {
      throw new BadRequestException(
        `User already exists with email ${data.email}`,
      );
    }
    const hashedPassword = await hashPassword({ password: data.password });

    const user = this.userRepository.createEntity({
      ...data,
      password: hashedPassword,
    });

    return plainToInstance(UserDto, await this.userRepository.save(user), {
      excludeExtraneousValues: true,
    });
  }

  async getAll(): Promise<UserDto[]> {
    return plainToInstance(UserDto, await this.userRepository.findAll(), {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException('user', 'id', id);
    }
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException('user', 'id', id);
    }
    return plainToInstance(
      UserDto,
      await this.userRepository.save({ ...user, ...data }),
      { excludeExtraneousValues: true },
    );
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(loginUserDto.email);
    if (!user) {
      throw new ResourceNotFoundException('user', 'id', loginUserDto.email);
    }
    const isPasswordValid = await comparePassword({
      password: loginUserDto.password,
      hashed: user.password,
    });
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Credentials');
    }
    const signToken = generateToken({ sub: user.id });
    return plainToInstance(
      UserDto,
      { ...user, accessToken: signToken },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getDetailsByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ResourceNotFoundException('user', 'id', email);
    }
    return plainToInstance(
      UserDto,
      { ...user },
      { excludeExtraneousValues: true },
    );
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}
