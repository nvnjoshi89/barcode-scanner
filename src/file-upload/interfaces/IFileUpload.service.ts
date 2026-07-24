export interface IFileUploadService {
  uploadFile(data: Express.Multer.File[], type: string);
  detachFile(key: string): Promise<void>;
  getImage(key: string, folder?: string): Promise<string>;
}
