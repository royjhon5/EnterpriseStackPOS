import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { SaleHeader } from '../../../Domain/Entities/Sales/SaleHeader';
import { SalesReturnDetail } from '../../../Domain/Entities/SalesReturn/SalesReturnDetail';
import { User } from '../../../Domain/Entities/User/User';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('sales_returns')
export class SalesReturn extends BaseEntity {
  @Column({ nullable: true })
  saleId: number;

  @ManyToOne(() => SaleHeader, { nullable: false })
  @JoinColumn({ name: 'saleId' })
  sale: SaleHeader;

  @Column({ nullable: true })
  branchId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ nullable: true })
  processedById: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'processedById' })
  processedBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  returnDate: Date;

  @Column({ length: 50 })
  reasonCode: string;

  @Column('decimal', { precision: 15, scale: 2 })
  totalRefund: number;

  @OneToMany(() => SalesReturnDetail, (detail) => detail.salesReturn, {
    cascade: true,
  })
  details: SalesReturnDetail[];
}
