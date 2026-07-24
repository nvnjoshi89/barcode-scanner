import { ExceptionType } from '@/enums/exception.types';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  errorType: string;
  constructor(message: string, status: HttpStatus, type: ExceptionType) {
    super(message, status);
    this.errorType = type;
  }
}
