import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { CategoriesModule } from './categories/categories.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionHandler } from './common/filter/error.filter';
import { LoggerModule } from 'nestjs-pino';
import { createPinoConfig } from './common/config/pino.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './common/config/db.config';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    LoggerModule.forRoot(createPinoConfig()),
    TypeOrmModule.forRootAsync({
      useFactory: async () => createTypeOrmConfig(),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ProductModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionHandler,
    },
  ],
})
export class AppModule {}
