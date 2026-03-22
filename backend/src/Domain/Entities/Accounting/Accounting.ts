import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { JournalLine } from './JournalLine';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Entity('accounts')
@Index(['tenant', 'accountCode'], { unique: true })
export class Account extends BaseEntity {
  @Column({ name: 'tenantId' })
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ length: 50 })
  accountCode: string;

  @Column({ length: 150 })
  accountName: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @OneToMany(() => JournalLine, (line) => line.account)
  journalLines: JournalLine[];
}
