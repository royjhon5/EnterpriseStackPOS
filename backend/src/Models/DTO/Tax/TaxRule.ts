import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from 'src/Domain/Entities/Tenant/Tenant';
import { Entity, Column, ManyToOne } from 'typeorm';

export enum TaxType {
  VAT = 'VAT',
  LOCAL = 'LOCAL',
  SERVICE = 'SERVICE',
}

export enum RoundingRule {
  ROUND = 'ROUND',
  CEIL = 'CEIL',
  FLOOR = 'FLOOR',
}

@Entity('tax_rules')
export class TaxRule extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: TaxType,
  })
  taxType: TaxType;

  @Column({ default: false })
  isInclusive: boolean;

  @Column({
    type: 'enum',
    enum: RoundingRule,
    default: RoundingRule.ROUND,
  })
  roundingRule: RoundingRule;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;
}
