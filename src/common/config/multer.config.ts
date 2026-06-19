import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
  if (!file) {
    return callback(new BadRequestException('File is required'), false);
  }
  callback(null, true);
};

//If your file is at /Users/me/project/src/common/file.service.ts, __dirname is /Users/me/project/src/common.
//path.resolve then looks at where you ended up and gives you that final string.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
});
