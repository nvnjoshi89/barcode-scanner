import { AppException } from './base.exception';
import { SYSTEM_ERROR_MESSAGE } from '../utils/error-messages';
import { HttpStatus } from '@nestjs/common';
import { ExceptionType } from '@/enums/exception.types';

export class SystemException extends AppException {
  constructor() {
    super(
      SYSTEM_ERROR_MESSAGE,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ExceptionType.SYSTEM_ERROR,
    );
  }
}
