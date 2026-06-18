import { SuccessEnum } from '@/enums/successCode.enum';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { MessageResponseDto } from '../dto/message-response.dto';
import { ApiResponseData, ApiResponseDto, PageInfo } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data: T | { data: T; page: PageInfo } | any) => {
        let message = data?.message;
        let error = undefined;
        let apiResponseData: ApiResponseData<T> | T;
        if (data && typeof data === 'object' && 'data' in data) {
          apiResponseData = {
            data: data.data,
            page: data.page,
          } as ApiResponseData<T>;
          message = data.message || SuccessEnum.SUCCESS;
        } else {
          apiResponseData = data;
        }

        return {
          code: data?.message ?? SuccessEnum.SUCCESS,
          message: message,
          data:
            apiResponseData instanceof MessageResponseDto
              ? null
              : apiResponseData,
          error: error,
          timestamp: new Date(),
        };
      }),
    );
  }
}
