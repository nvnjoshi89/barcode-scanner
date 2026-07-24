import { HttpStatus } from '@nestjs/common';
import { AppException } from './base.exception';
import { ExceptionType } from '@/enums/exception.types';

export class MissingHeaderException extends AppException {
  constructor(headername: string) {
    super(
      `Header [${headername}] is missing`,
      HttpStatus.BAD_REQUEST,
      ExceptionType.MISSING_HEADER,
    );
  }
}
