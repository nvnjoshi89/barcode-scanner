import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/model/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
