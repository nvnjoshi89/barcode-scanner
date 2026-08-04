import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { FileDetailModule } from '@/file-details/file-detail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FileDetailModule],
  controllers: [ProductsController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
