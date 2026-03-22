import { IdentityUser } from '../../../Domain/Entities/BaseEntity/IdentityUser';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { UserRole } from '../../../Domain/Entities/Role/UserRole';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('Application_User')
export class User extends IdentityUser {
  /* --------------------
   * Foreign Keys
   * -------------------- */

  @Column({ name: 'TenantID' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TenantID' })
  tenant: Tenant;

  @Column({ name: 'BranchID', nullable: true })
  branchId: number | null;

  @ManyToOne(() => Branch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'BranchID' })
  branch?: Branch | null;

  /* --------------------
   * User Info
   * -------------------- */

  @Column({ name: 'FullName', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'LastLogin', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
