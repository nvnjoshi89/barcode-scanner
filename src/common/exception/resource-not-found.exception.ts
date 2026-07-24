import { HttpStatus } from '@nestjs/common';
import { AppException } from './base.exception';
import { ExceptionType } from '@/enums/exception.types';

export class ResourceNotFoundException extends AppException {
  constructor(resource: string, field: string, value: string | number) {
    super(
      `${resource} not found with ${field} : ${value}`,
      HttpStatus.NOT_FOUND,
      ExceptionType.DATA_NOT_FOUND,
    );
  }
}
