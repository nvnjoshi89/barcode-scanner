import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  barcode: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  image: any;

  @Expose()
  categortId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updateAt: Date;
}
