import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { JournalLine } from './JournalLine';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum ReferenceType {
  SALE = 'SALE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('journal_entries')
export class JournalEntry extends BaseEntity {
  @Column({ name: 'tenantId' })
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: ReferenceType,
  })
  referenceType: ReferenceType;

  @Column()
  referenceId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  postedAt: Date;

  @OneToMany(() => JournalLine, (line) => line.journalEntry, {
    cascade: true,
  })
  journalLines: JournalLine[];
}
