import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SaleHeader } from '../../../Domain/Entities/Sales/SaleHeader';
import { Tax } from '../../../Domain/Entities/Tax/Tax';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';

@Entity('sale_taxes')
export class SaleTax extends BaseEntity {
  @ManyToOne(() => SaleHeader, (sale) => sale.saleTaxes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'saleId' })
  sale: SaleHeader;

  @ManyToOne(() => Tax)
  @JoinColumn({ name: 'taxId' })
  tax: Tax;

  @Column('decimal', { precision: 12, scale: 2 })
  taxAmount: number;
}
