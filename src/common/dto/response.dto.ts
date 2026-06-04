export interface PageInfo {
  totalPage: number;
  totalElement: number;
  last: boolean;
  first: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponseData<T> {
  data: T;
  page?: PageInfo;
}

export class ApiResponseDto<T> {
  message: string;
  data: ApiResponseData<T> | T;
  error?: any;
  timestamp: Date;
  code: string;
}
