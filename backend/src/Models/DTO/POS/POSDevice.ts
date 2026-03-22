import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from 'src/Domain/Entities/Branch/Branch';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

@Entity('pos_devices')
@Index(['branch', 'deviceCode'], { unique: true })
export class POSDevice extends BaseEntity {
  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @Column({ length: 50 })
  deviceCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date;
}
