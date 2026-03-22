import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { User } from '../../../Domain/Entities/User/User';
import { Entity, Column, ManyToOne } from 'typeorm';

export enum CashSessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('cash_sessions')
export class CashSession extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @ManyToOne(() => User, { nullable: false })
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
}
