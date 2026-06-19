import { BaseRepository } from '@/common/repository/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { DataSource, IsNull } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@Inject(DataSource) dataSource: DataSource, cls: ClsService) {
    super(Product, dataSource, cls);
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.findOne({
      where: { barcode, deletedDate: IsNull() },
    });
  }

  async findAllProducts(): Promise<Product[]> {
    return this.findAll({
      where: { deletedDate: IsNull(), isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(options: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    return this.paginate(options, {
      where: { deletedDate: IsNull() },
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.updateEntity(
      { id } as any,
      {
        deletedDate: new Date(),
      } as any,
    );
  }
}
