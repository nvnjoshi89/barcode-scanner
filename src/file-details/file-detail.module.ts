import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileDetails } from './file-detail.entity';
import { FileDetailRepository } from './file-detail.repository';
import { FileDetailService } from './file-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileDetails])],
  controllers: [],
  providers: [FileDetailRepository, FileDetailService],
  exports: [FileDetailService],
})
export class FileDetailModule {}
