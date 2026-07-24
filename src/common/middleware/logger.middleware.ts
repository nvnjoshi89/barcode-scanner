import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(LoggerMiddleware.name)
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(LoggerMiddleware.name);
  }
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const logger = this.logger;
    logger.info({
      message: 'HTTP Request Received',
      method: req.method,
      url: req.originalUrl,
      requestHeaders: req.headers,
      requestBody: req.body,
    });

    const originalSend = res.send;
    res.send = function (body: any): Response {
      const responseTime = Date.now() - start;

      logger.info({
        message: 'HTTP Response Sent',
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        responseBody: tryParseJson(body),
      });

      return originalSend.call(this, body);
    };

    next();
  }
}

function tryParseJson(data: any) {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    return '[Non-JSON Response]';
  }
}
