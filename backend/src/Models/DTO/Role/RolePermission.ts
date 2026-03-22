import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Permission } from 'src/Domain/Entities/Permission/Permission';
import { Role } from 'src/Domain/Entities/Role/Role';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission extends BaseEntity {
  @Column({ name: 'RoleID' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'RoleID' })
  role: Role;

  @Column({ name: 'PermissionID' })
  permissionId: number;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PermissionID' })
  permission: Permission;
}
