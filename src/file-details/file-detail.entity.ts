import { BaseEntity } from '@/common/model/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'file_details' })
export class FileDetails extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'file_key',
  })
  fileKey: string;

  @Column({
    type: 'varchar',
    name: 'original_name',
  })
  originalName: string;

  @Column({
    type: 'tinyint',
    default: 0,
  })
  isPrimary: number;

  @Column({
    type: 'varchar',
  })
  filePath: string;

  @Column({
    type: 'varchar',
  })
  module: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  moduleId: number;
}
