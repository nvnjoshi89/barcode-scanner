import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { PinoLogger } from 'nestjs-pino';
import { Observable, from } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { DataSource, QueryRunner } from 'typeorm';
import { TRANSACTIONAL_KEY } from '../decorators/transactional.decorator';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
    private readonly reflector: Reflector,
    private readonly cls: ClsService,
  ) {
    this.logger.setContext(TransactionInterceptor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const isTransactional =
      this.reflector.get<boolean>(TRANSACTIONAL_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(TRANSACTIONAL_KEY, context.getClass());

    if (!isTransactional) {
      this.logger.debug(`No transaction needed for ${method} ${url}`);
      return next.handle();
    }

    this.logger.info(`Starting transaction for ${method} ${url}`);
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.cls.set(ENTITY_MANAGER_KEY, queryRunner.manager);

    const startTime = Date.now();

    return next.handle().pipe(
      switchMap((data) =>
        from(
          (async () => {
            this.logger.info(`Committing transaction for ${method} ${url}`);
            await queryRunner.commitTransaction();
            return data;
          })(),
        ),
      ),
      catchError((error) =>
        from(
          (async () => {
            this.logger.error(
              `Error in transaction for ${method} ${url}: ${error}`,
            );
            this.logger.error(`Rolling back transaction for ${method} ${url}`);
            await queryRunner.rollbackTransaction();
            throw error;
          })(),
        ),
      ),
      finalize(async () => {
        this.logger.info(
          `Releasing query runner for ${method} ${url} (took ${
            Date.now() - startTime
          }ms)`,
        );
        await queryRunner.release();
      }),
    );
  }
}
