import { HeaderDto } from '@/common/dto/headers.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUserService {
  getAll(): Promise<UserDto[]>;
  getById(id: number): Promise<UserDto>;
  signupUser(data: CreateUserDto, headerdto: HeaderDto): Promise<UserDto>;
  update(id: number, data: UpdateUserDto): Promise<UserDto>;
  getDetailsByEmail(email: string): Promise<UserDto>;
  login(loginUserDto: LoginUserDto);
}
