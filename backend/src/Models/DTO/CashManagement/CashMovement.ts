import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';
import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';

export enum CashMovementType {
  SALE = 'SALE',
  REFUND = 'REFUND',
  DROP = 'DROP',
  PAYOUT = 'PAYOUT',
}

@Entity('cash_movements')
export class CashMovement extends BaseEntity {
  @ManyToOne(() => CashSession, { nullable: false, onDelete: 'CASCADE' })
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
