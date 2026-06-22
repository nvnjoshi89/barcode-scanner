import { Params } from 'nestjs-pino';
import { isLocal } from './config.loader';

export const createPinoConfig = (): Params => {
  return {
    pinoHttp: {
      level: isLocal() ? 'debug' : 'info',
      autoLogging: false,
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          translateTime: 'SYS:standard',
          colorize: true,
          ignore: 'pid,hostname,context,req',
          messageFormat: '[{context}] {msg}',
        },
      },
    },
  };
};
