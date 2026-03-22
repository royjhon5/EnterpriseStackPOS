import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { RolePermission } from '../../../Domain/Entities/Role/RolePermission';
import { UserRole } from '../../../Domain/Entities/Role/UserRole';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('Application_role')
export class Role extends BaseEntity {
  @Column({ name: 'RoleName', type: 'varchar', length: 50, unique: true })
  roleName: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
