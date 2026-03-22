import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Product } from '../../../Domain/Entities/Product/Product';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @Column()
  barcode: string;

  @Column()
  unit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  costPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
