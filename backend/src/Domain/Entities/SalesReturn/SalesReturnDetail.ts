import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { SaleDetail } from '../../../Domain/Entities/Sales/SaleDetail';
import { SalesReturn } from './SalesReturn';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('sales_return_details')
@Check(`"quantity" > 0`)
@Check(`"refundAmount" >= 0`)
export class SalesReturnDetail extends BaseEntity {
  @Column({ nullable: true })
  salesReturnId: number;

  @ManyToOne(() => SalesReturn, (header) => header.details, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'salesReturnId' })
  salesReturn: SalesReturn;

  @Column({ nullable: true })
  saleDetailId: number;

  @ManyToOne(() => SaleDetail, { nullable: false })
  @JoinColumn({ name: 'saleDetailId' })
  saleDetail: SaleDetail;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2 })
  refundAmount: number;
}
