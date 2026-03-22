import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Entity, Column, ManyToOne, Index, Check } from 'typeorm';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';

@Entity('stock_batches')
@Index(['variant', 'branch'])
@Check(`"quantity" >= 0`)
@Check(`"costPrice" >= 0`)
export class StockBatch extends BaseEntity {
  @ManyToOne(() => ProductVariant, { nullable: false })
  variant: ProductVariant;

  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @Column('decimal', { precision: 15, scale: 2 })
  costPrice: number;

  @Column('int')
  quantity: number;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;
}
