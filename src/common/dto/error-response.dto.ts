export class ErrorResponseDto {
  errorType: string;
  message: string;
  timestamp: Date;

  constructor(errorType: string, message: string) {
    this.errorType = errorType;
    this.message = message;
    this.timestamp = new Date();
  }
}
