import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { PriceList } from '../../../Domain/Entities/Pricing/PricingList';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';

import { Entity, ManyToOne, Column, Index, Check, JoinColumn } from 'typeorm';

@Entity('price_list_items')
@Index(['priceList', 'variant'], { unique: true })
@Check(`"sellingPrice" >= 0`)
export class PriceListItem extends BaseEntity {
  @Column({ name: 'priceListId' })
  priceListId: number;

  @ManyToOne(() => PriceList, (list) => list.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'priceListId' })
  priceList: PriceList;

  @Column({ name: 'variantId' })
  variantId: number;

  @ManyToOne(() => ProductVariant, { nullable: false })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column('decimal', { precision: 15, scale: 2 })
  sellingPrice: number;
}
