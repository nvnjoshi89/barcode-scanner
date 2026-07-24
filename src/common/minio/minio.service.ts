import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { getEnvValue } from '../config/config.loader';
import * as Minio from 'minio';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucketName: string = getEnvValue('MINIO_BUCKET_NAME');
  private readonly minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: getEnvValue('MINIO_ENDPOINT'),
      port: Number(getEnvValue('MINIO_PORT')),
      accessKey: getEnvValue('MINIO_ACCESS_KEY'),
      secretKey: getEnvValue('MINIO_SECRET_KEY'),
      region: getEnvValue('MINIO_REGION') || 'us-east-1',
      useSSL: false,
    });
  }

  private async uploadSingleFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileKey: string; originalName: string }> {
    try {
      let fileContent: Buffer;
      if (file.buffer) {
        fileContent = file.buffer;
      } else if (file.path) {
        fileContent = await fs.promises.readFile(file.path);
      } else {
        throw new BadRequestException('No file content available');
      }
      file.filename = `${Date.now()}`;
      const key = folder ? `${folder}/${file.filename}` : file.filename;
      await this.minioClient.putObject(
        this.bucketName,
        key,
        fileContent,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );
      if (file.path) {
        try {
          await unlinkAsync(file.path);
        } catch (cleanupError) {
          this.logger.warn(
            `Failed to cleanup temporary file ${file.path}: ${cleanupError}`,
          );
        }
      }
      return {
        fileKey: file.filename,
        originalName: file.originalname,
      };
    } catch (error) {
      this.logger.error(`File upload failed: ${error}`, error);
      throw new BadRequestException(`Failed to upload file: ${error}`);
    }
  }

  async uploadFile(file: Express.Multer.File[], folder?: string) {
    if (!file || file.length === 0) {
      throw new BadRequestException('No file provided');
    }
    try {
      if (file.some((file) => !file)) {
        throw new BadRequestException('One or more files are corrupted');
      }
      return Promise.all(
        file.map(async (item) => await this.uploadSingleFile(item, folder)),
      );
    } catch (error) {
      this.logger.error(`File upload failed: ${error}`, error);
      throw new BadRequestException(`Failed to upload files: ${error}`);
    }
  }

  private getKeyFromUrl(fileUrl: string): string {
    try {
      const urlObj = new URL(fileUrl);
      const pathParts = urlObj.pathname
        .split('/')
        .filter((part) => part.length > 0);
      const bucketIndex = pathParts.indexOf(this.bucketName);
      if (bucketIndex !== -1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      return pathParts.join('/');
    } catch (error) {
      this.logger.error(`Failed to parse URL: ${error}`, error);
      throw new BadRequestException(`Invalid file URL : ${fileUrl}`);
    }
  }

  async detachFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new BadRequestException('No file URL provided');
    }
    try {
      const key = this.getKeyFromUrl(fileUrl);
      await this.minioClient.removeObject(this.bucketName, key);
    } catch (error) {
      this.logger.error(`Failed to detach file: ${error}`, error);
      throw new BadRequestException(`Failed to detach file: ${error}`);
    }
  }

  async getImage(key: string): Promise<string> {
    if (!key) {
      throw new BadRequestException('No image key provided');
    }
    try {
      const publicUrl = `${this.bucketName}/${key}`;
      await this.minioClient.statObject(this.bucketName, key);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to get presigned URL: ${error}`, error);
      throw new BadRequestException(`Failed to generate image URL:${error}`);
    }
  }

  async getSignedImage(key: string): Promise<string> {
    if (!key) {
      throw new BadRequestException('No image key provided');
    }
    try {
      const imageUrl = await this.minioClient.presignedGetObject(
        this.bucketName,
        key,
      );
      return imageUrl;
    } catch (error) {
      this.logger.error(`Failed to get presigned URL : ${error}`, error);
      throw new BadRequestException(`Failed to generate image URL: ${error}`);
    }
  }
}
