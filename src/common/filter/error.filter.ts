import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { AppException } from '../exception/base.exception';
import { ExceptionType } from '@/enums/exception.types';
import { MissingHeaderException } from '../exception/missing-header-exception';
import { BadRequestException as customBadRequestException } from '../exception/bad-request.exception';
import { ResourceNotFoundException } from '../exception/resource-not-found.exception';
import { SYSTEM_ERROR_MESSAGE } from '../utils/error-messages';

interface ValidationError {
  field: string;
  message: string;
}
interface ErrorResponseDto {
  message: string;
  data: null;
  error: {
    errorType: string;
    errorDetails?: ValidationError[] | any;
  };
  timestamp: Date;
}

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(GlobalExceptionHandler.name);
  }
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorResponse = this.buildErrorResponse(exception);
    this.logger.error({
      errorResponse: errorResponse.message,
      exception: exception,
      path: request.url,
      method: request.method,
    });

    const statusCode = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: any): ErrorResponseDto {
    const timestamp = new Date();
    const statusCode =
      exception?.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      return this.handleValidationError(exception, timestamp);
    }
    if (exception instanceof AppException) {
      return this.buildExceptionResponse(
        exception,
        exception.errorType,
        timestamp,
      );
    }
    if (exception instanceof NotFoundException) {
      return this.buildExceptionResponse(
        exception,
        ExceptionType.ROUTE_NOT_FOUND,
        timestamp,
      );
    }
    if (exception instanceof MissingHeaderException) {
      return this.buildExceptionResponse(
        exception,
        ExceptionType.MISSING_HEADER,
        timestamp,
      );
    }
    if (exception instanceof customBadRequestException) {
      return this.buildExceptionResponse(
        exception,
        ExceptionType.BAD_REQUEST,
        timestamp,
      );
    }
    if (exception instanceof ResourceNotFoundException) {
      return this.buildExceptionResponse(
        exception,
        ExceptionType.DATA_NOT_FOUND,
        timestamp,
      );
    }
    if (exception instanceof UnauthorizedException) {
      return this.buildExceptionResponse(
        exception,
        ExceptionType.UNAUTHORIZED,
        timestamp,
      );
    }
    return {
      message: SYSTEM_ERROR_MESSAGE,
      data: null,
      error: {
        errorType: ExceptionType.SYSTEM_ERROR.toString(),
      },
      timestamp,
    };
  }

  private handleValidationError(
    exception: BadRequestException,
    timestamp: Date,
  ): ErrorResponseDto {
    const responseData = exception.getResponse();
    return {
      message: 'Validation failed',
      data: null,
      error: {
        errorType: 'VALIDATION_ERROR',
        errorDetails: responseData,
      },
      timestamp,
    };
  }

  private buildExceptionResponse(
    exception: any,
    exceptionType: ExceptionType | string,
    timestamp: Date,
  ): ErrorResponseDto {
    const response = exception.response;
    return {
      message: response.message ? response.message : response.error,
      data: null,
      error: {
        errorType: exceptionType.toString(),
      },
      timestamp,
    };
  }
}
