import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { PromotionRule } from 'src/Domain/Entities/Promotion/PromotionRule';
import { Tenant } from 'src/Domain/Entities/Tenant/Tenant';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

export enum PromotionType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

@Entity('promotions')
export class Promotion extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: PromotionType,
  })
  type: PromotionType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => PromotionRule, (rule) => rule.promotion, {
    cascade: true,
  })
  rules: PromotionRule[];
}
