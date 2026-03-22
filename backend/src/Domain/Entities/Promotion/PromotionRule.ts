import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Entity, ManyToOne, Column, Index, Check } from 'typeorm';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { Promotion } from '../../../Domain/Entities/Promotion/Promotion';

@Entity('promotion_rules')
@Index(['promotion', 'variant'], { unique: true })
@Check(`"discountValue" >= 0`)
export class PromotionRule extends BaseEntity {
  @ManyToOne(() => Promotion, (promo) => promo.rules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  promotion: Promotion;

  @ManyToOne(() => ProductVariant, { nullable: false })
  variant: ProductVariant;

  @Column('decimal', { precision: 15, scale: 2 })
  discountValue: number;
}
