import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Role } from '../../../Domain/Entities/Role/Role';
import { User } from '../../../Domain/Entities/User/User';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRole extends BaseEntity {
  /* --------------------
   * Foreign Keys
   * -------------------- */

  @Column({ name: 'UserID' })
  userId: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  @Column({ name: 'RoleID' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoleID' })
  role: Role;
}
