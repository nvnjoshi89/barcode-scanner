import {
  Controller,
  Param,
  UploadedFiles,
  UseInterceptors,
  Post,
  Get,
} from '@nestjs/common';
import { FileUploadServiceImpl } from './file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadOptions } from '@/common/config/multer.config';

@Controller('v1/file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadServiceImpl) {}
  @Post(':type')
  @UseInterceptors(FilesInterceptor('files', 10, FileUploadOptions))
  async uploadFile(
    @UploadedFiles()
    file: Express.Multer.File[],
    @Param('type') type: string,
  ) {
    const result = await this.fileUploadService.uploadFile(file, type);
    return result;
  }

  @Get(':key')
  async getImage(@Param('key') key: string): Promise<string> {
    return this.fileUploadService.getImage(key);
  }
}
