import { BaseRepository } from '@/common/repository/base.repository';

import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject(DataSource) dataSource: DataSource, cls: ClsService) {
    super(User, dataSource, cls);
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }
}
