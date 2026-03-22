import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { SaleDetail } from '../../../Domain/Entities/Sales/SaleDetail';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Payment } from '../../../Domain/Entities/Transaction/Payment';
import { SaleTax } from '../../../Domain/Entities/Tax/SaleTax';
import { User } from '../../../Domain/Entities/User/User';

export enum SaleStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  VOIDED = 'VOIDED',
  REFUNDED = 'REFUNDED',
}

@Entity('sale_headers')
export class SaleHeader extends BaseEntity {
  @Column({ nullable: true })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  branchId: number;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ nullable: true })
  cashierId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cashierId' })
  cashier: User;

  @Column({ nullable: true })
  customerId?: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer?: Customer;

  @Column()
  receiptNo: string;

  @Column('decimal', { precision: 12, scale: 2 })
  grossAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  netAmount: number;

  @CreateDateColumn()
  saleDate: Date;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.PENDING_PAYMENT,
  })
  status: SaleStatus;

  @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true })
  saleDetails: SaleDetail[];

  @OneToMany(() => Payment, (payment) => payment.sale, { cascade: true })
  payments: Payment[];

  @OneToMany(() => SaleTax, (saleTax) => saleTax.sale, { cascade: true })
  saleTaxes: SaleTax[];
}
