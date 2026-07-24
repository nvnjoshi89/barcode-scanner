import { BadRequestException, Injectable } from '@nestjs/common';
import { IFileUploadService } from './interfaces/IFileUpload.service';
import { MinioService } from '@/common/minio/minio.service';
import { FileDetailService } from '@/file-details/file-detail.service';
import { FOLDER_TYPE } from '@/common/utils/constant';
import { resolve } from 'path';

@Injectable()
export class FileUploadServiceImpl implements IFileUploadService {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileDetailService: FileDetailService,
  ) {}
  async uploadFile(data: Express.Multer.File[], type: string) {
    if (!FOLDER_TYPE.includes(type))
      throw new BadRequestException('Invalid folder type');
    const folder = type;
    const uploadFile = await this.minioService.uploadFile(data, folder);
    return await this.fileDetailService.insertFileDetail(
      uploadFile.map((item) => {
        return {
          ...item,
          filePath: folder ? `${folder}/${item.fileKey}` : item.fileKey,
          module: folder,
        };
      }),
    );
  }

  async detachFile(key: string): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
  async getImage(key: string, folder?: string): Promise<string> {
    const imageUrl = await this.minioService.getImage(
      `${folder ? folder + '/' : ''}${key}`,
    );
    return imageUrl;
  }
}
