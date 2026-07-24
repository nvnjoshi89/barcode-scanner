import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FileDetailResponseDto } from './dto/response.dto';
import { FileDetailRepository } from './file-detail.repository';
import { IsNull } from 'typeorm';
import { FileDetails } from './file-detail.entity';

@Injectable()
export class FileDetailService {
  constructor(private readonly fileDetailRepository: FileDetailRepository) {}
  async getFileDetailByKey(key: string) {
    return this.fileDetailRepository.findOne({ where: { fileKey: key } });
  }
  async insertFileDetail(
    fileDetail: Record<string, string>[],
  ): Promise<FileDetailResponseDto[]> {
    return await Promise.all(
      fileDetail.map(async (item) => {
        const saved = await this.fileDetailRepository.save(
          this.fileDetailRepository.createEntity(
            plainToInstance(FileDetails, item),
          ),
        );
        return plainToInstance(FileDetailResponseDto, saved, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
  async updateFileDetail(key: string, fileDetail: Record<string, unknown>) {
    await this.fileDetailRepository.updateEntity({ fileKey: key }, fileDetail);
  }
  async getFileDetailsByModuleId(
    moduleId: number,
    module: string,
  ): Promise<FileDetailResponseDto[]> {
    const fileDetails = await this.fileDetailRepository.findAll({
      where: { moduleId, deletedDate: IsNull(), module },
      order: { createdDate: 'DESC' },
    });
    return plainToInstance(FileDetailResponseDto, fileDetails, {
      excludeExtraneousValues: true,
    });
  }
}
