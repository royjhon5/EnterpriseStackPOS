import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';

@Entity('pos_devices')
@Index(['branch', 'deviceCode'], { unique: true })
export class POSDevice extends BaseEntity {
  @Column({ name: 'branchId' })
  branchId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ length: 50 })
  deviceCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date | null;
}
