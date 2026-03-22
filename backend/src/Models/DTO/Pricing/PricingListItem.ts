import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { PriceList } from 'src/Domain/Entities/Pricing/PricingList';
import { ProductVariant } from 'src/Domain/Entities/Product/ProductVariant';

import { Entity, ManyToOne, Column, Index, Check } from 'typeorm';

@Entity('price_list_items')
@Index(['priceList', 'variant'], { unique: true })
@Check(`"sellingPrice" >= 0`)
export class PriceListItem extends BaseEntity {
  @ManyToOne(() => PriceList, (list) => list.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  priceList: PriceList;

  @ManyToOne(() => ProductVariant, { nullable: false })
  variant: ProductVariant;

  @Column('decimal', { precision: 15, scale: 2 })
  sellingPrice: number;
}
