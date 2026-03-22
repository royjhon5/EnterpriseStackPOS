import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { SaleHeader } from '../../../Domain/Entities/Sales/SaleHeader';

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  EWALLET = 'EWALLET',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ nullable: true })
  saleId: number;

  @ManyToOne(() => SaleHeader, (sale) => sale.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale: SaleHeader;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  referenceNo?: string;
}
