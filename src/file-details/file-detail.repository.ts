import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FileDetails } from './file-detail.entity';
import { BaseRepository } from '@/common/repository/base.repository';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class FileDetailRepository extends BaseRepository<FileDetails> {
  constructor(@Inject(DataSource) dataSource: DataSource, cls: ClsService) {
    super(FileDetails, dataSource, cls);
  }
}
