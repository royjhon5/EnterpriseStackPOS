import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { SaleHeader } from '../../../Domain/Entities/Sales/SaleHeader';

@Entity('sale_details')
export class SaleDetail extends BaseEntity {
  @Column({ nullable: true })
  saleId: number;

  @ManyToOne(() => SaleHeader, (sale) => sale.saleDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'saleId' })
  sale: SaleHeader;

  @Column({ nullable: true })
  variantId: number;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 12, scale: 2 })
  lineTotal: number;
}
