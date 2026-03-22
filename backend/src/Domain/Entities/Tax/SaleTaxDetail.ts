import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { SaleDetail } from '../../../Domain/Entities/Sales/SaleDetail';
import { TaxRule } from './TaxRule';
import { Entity, Column, ManyToOne, Check } from 'typeorm';

@Entity('sale_tax_details')
@Check(`"taxAmount" >= 0`)
export class SaleTaxDetail extends BaseEntity {
  @ManyToOne(() => SaleDetail, { nullable: false, onDelete: 'CASCADE' })
  saleDetail: SaleDetail;

  @ManyToOne(() => TaxRule, { nullable: false })
  taxRule: TaxRule;

  @Column('decimal', { precision: 15, scale: 2 })
  taxAmount: number;
}
