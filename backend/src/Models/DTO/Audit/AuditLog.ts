import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../../Domain/Entities/User/User';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  action: string; // e.g., CREATE, UPDATE, DELETE

  @Column()
  entityName: string; // name of the entity that changed

  @Column()
  entityId: string; // primary key of the changed entity, stored as string to support UUID or number

  @Column({ type: 'text', nullable: true })
  oldValue?: string; // JSON string

  @Column({ type: 'text', nullable: true })
  newValue?: string; // JSON string

  @CreateDateColumn()
  createdAt: Date;
}
