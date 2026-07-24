import { HttpException } from '@nestjs/common';

export class ExternalServiceException extends HttpException {
  public readonly isExternalServiceException = true;
  constructor(response: any, status: number) {
    super(response, status);
  }
}
