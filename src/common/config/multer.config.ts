import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';

const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
  if (!file) {
    return callback(new BadRequestException('File is required'), false);
  }

  callback(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = path
      .parse(file.originalname)
      .name.replace(/[^a-zA-Z0-9]/g, '');
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${originalName}${ext}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 10 * 1024 * 1024 * 1024,
};

export const FileUploadOptions: MulterOptions = {
  fileFilter,
  storage,
  limits,
};
