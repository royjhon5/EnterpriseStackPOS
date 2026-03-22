import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { User } from 'src/Domain/Entities/User/User';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

export enum LoginStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  LOCKED = 'LOCKED',
}

@Entity('login_audits')
@Index(['loginTime'])
@Index(['user', 'loginTime'])
export class LoginAudit extends BaseEntity {
  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ length: 45 })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  deviceInfo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loginTime: Date;

  @Column({
    type: 'enum',
    enum: LoginStatus,
  })
  status: LoginStatus;
}
