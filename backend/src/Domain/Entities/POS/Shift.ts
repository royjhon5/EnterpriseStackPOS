import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { User } from '../../../Domain/Entities/User/User';
import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';

@Entity('shifts')
@Index(['branch', 'startTime'])
export class Shift extends BaseEntity {
  @Column({ name: 'branchId' })
  branchId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date | null;
}
