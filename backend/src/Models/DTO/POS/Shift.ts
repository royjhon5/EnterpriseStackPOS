import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from 'src/Domain/Entities/Branch/Branch';
import { User } from 'src/Domain/Entities/User/User';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

@Entity('shifts')
@Index(['branch', 'startTime'])
export class Shift extends BaseEntity {
  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;
}
