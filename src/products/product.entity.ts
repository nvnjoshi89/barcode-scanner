import { BaseEntity } from '@/common/model/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ unique: true })
  barcode: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  categoryId: number;
}
