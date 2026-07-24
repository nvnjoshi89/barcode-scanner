import { UserDto } from '@/user/dto/response.dto';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ResourceNotFoundException } from '../exception/resource-not-found.exception';

@Injectable()
export class UserSessionService {
  constructor(private readonly clsService: ClsService) {}

  getSessionUser(): UserDto {
    const user = this.clsService.get<UserDto>('user');
    if (!user) throw new ResourceNotFoundException('user', 'id', user.id);
    return user;
  }
  setSessionUser(user: UserDto): void {
    this.clsService.set('user', user);
  }
}
