import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { User } from '../../../Domain/Entities/User/User';
import { CashMovement } from '../../../Domain/Entities/CashManagement/CashMovement';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

export enum CashSessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('cash_sessions')
export class CashSession extends BaseEntity {
  @Column({ name: 'tenantId' })
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ name: 'branchId' })
  branchId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ name: 'cashierId' })
  cashierId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'cashierId' })
  cashier: User;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  closingBalance: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  expectedBalance: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  variance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  openedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({
    type: 'enum',
    enum: CashSessionStatus,
    default: CashSessionStatus.OPEN,
  })
  status: CashSessionStatus;

  @OneToMany(() => CashMovement, (movement) => movement.session)
  movements: CashMovement[];
}
