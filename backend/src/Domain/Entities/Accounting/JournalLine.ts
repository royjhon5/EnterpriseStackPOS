import { Account } from '../../../Domain/Entities/Accounting/Accounting';
import { JournalEntry } from '../../../Domain/Entities/Accounting/Journal';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';

import { Entity, Column, ManyToOne, Check, JoinColumn } from 'typeorm';

@Entity('journal_lines')
@Check(`("debit" >= 0 AND "credit" >= 0)`)
export class JournalLine extends BaseEntity {
  @Column({ name: 'journalEntryId' })
  journalEntryId: number;

  @ManyToOne(() => JournalEntry, (journal) => journal.journalLines, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry: JournalEntry;

  @Column({ name: 'accountId' })
  accountId: number;

  @ManyToOne(() => Account, (account) => account.journalLines, {
    nullable: false,
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  credit: number;
}
