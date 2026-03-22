import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';

@Entity('daily_sales_summaries')
@Unique(['branch', 'salesDate'])
export class DailySalesSummary extends BaseEntity {
  @Column({ name: 'branchId' })
  branchId: number;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ type: 'date' })
  salesDate: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalSales: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalTax: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalDiscount: number;
}
