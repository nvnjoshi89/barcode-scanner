import { BadRequestException, Injectable } from '@nestjs/common';
import { IProductService } from './product.service.interface';
import { ProductRepository } from './product.repository';
import { ProductResponseDto } from './dto/product.response.dto';
import { plainToInstance } from 'class-transformer';
import { IsNull } from 'typeorm';
import { InsertProductDto } from './dto/insert-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService implements IProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllproducts(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAllProducts();
    return plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
  }

  async getProductById(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id, deletedDate: IsNull() },
    });
    if (!product) {
      throw new BadRequestException('product not found');
    }
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async getProductByBarcode(barcode: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new BadRequestException('product not found for this barcode');
    }

    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async insertProductDto(dto: InsertProductDto): Promise<ProductResponseDto> {
    const existing = await this.productRepository.findByBarcode(dto.barcode);

    if (existing) {
      throw new BadRequestException('Barcode already exists');
    }
    const product = await this.productRepository.createEntity({ ...dto });
    const savedProduct = await this.productRepository.save(product);
    return plainToInstance(ProductResponseDto, savedProduct, {
      excludeExtraneousValues: true,
    });
  }

  async updateProduct(
    id: number,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id, deletedDate: IsNull() },
    });
    if (!product) {
      throw new BadRequestException('product not found');
    }
    const updateProduct = await this.productRepository.updateEntity( {id}
      { ...product, ...data },
    );
    return plainToInstance(ProductResponseDto, updateProduct, {
      excludeExtraneousValues: true,
    });
  }
}
