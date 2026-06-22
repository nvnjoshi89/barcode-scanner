import { Expose } from 'class-transformer';

export class FileDetailResponseDto {
  @Expose()
  id: string;
  @Expose()
  filekey: string;
  @Expose()
  originalName: string;
  @Expose()
  module: string;
  @Expose()
  deletedDate: Date | null;
  @Expose()
  isPrimary: number;
}
