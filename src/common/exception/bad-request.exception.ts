import { HttpStatus } from '@nestjs/common';
import { AppException } from './base.exception';
import { ExceptionType } from '@/enums/exception.types';

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad request', errorCode?: number) {
    super(
      message,
      errorCode ?? HttpStatus.BAD_REQUEST,
      ExceptionType.INVALID_DATA,
    );
  }
}
