import { BaseEntity } from '@/common/model/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ unique: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
