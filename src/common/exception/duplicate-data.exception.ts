import { HttpStatus } from '@nestjs/common';
import { AppException } from './base.exception';
import { ExceptionType } from '@/enums/exception.types';

export class DuplicateDataException extends AppException {
  constructor(entity: string, field: string, value: string | number) {
    super(
      `${entity} with the ${field}: ${value} already exists`,
      HttpStatus.CONFLICT,
      ExceptionType.DUPLICATE_DATA,
    );
  }
}
