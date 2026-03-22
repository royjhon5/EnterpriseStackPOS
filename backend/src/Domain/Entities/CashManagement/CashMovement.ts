import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';

export enum CashMovementType {
  SALE = 'SALE',
  REFUND = 'REFUND',
  DROP = 'DROP',
  PAYOUT = 'PAYOUT',
}

@Entity('cash_movements')
export class CashMovement extends BaseEntity {
  @Column({ name: 'sessionId' })
  sessionId: number;

  @ManyToOne(() => CashSession, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: CashSession;

  @Column({
    type: 'enum',
    enum: CashMovementType,
  })
  movementType: CashMovementType;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 100, nullable: true })
  referenceNo: string;

  @CreateDateColumn()
  createdAt: Date;
}
