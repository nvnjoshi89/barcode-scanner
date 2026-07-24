import { CommonModule } from '@/common/common.module';
import { FileDetailModule } from '@/file-details/file-detail.module';
import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadServiceImpl } from './file-upload.service';

@Module({
  imports: [CommonModule, FileDetailModule],
  controllers: [FileUploadController],
  providers: [FileUploadServiceImpl],
  exports: [FileUploadServiceImpl],
})
export class FileUploadModule {}
