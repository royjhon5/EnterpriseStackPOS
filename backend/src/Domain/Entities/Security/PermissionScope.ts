import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Entity, ManyToOne, Column, Check } from 'typeorm';
import { Permission } from '../../../Domain/Entities/Permission/Permission';

export enum ScopeType {
  TENANT = 'TENANT',
  BRANCH = 'BRANCH',
}

@Entity('permission_scopes')
@Check(`
  ("scopeType" = 'TENANT' AND "tenantId" IS NOT NULL AND "branchId" IS NULL)
  OR
  ("scopeType" = 'BRANCH' AND "branchId" IS NOT NULL)
`)
export class PermissionScope extends BaseEntity {
  @ManyToOne(() => Permission, { nullable: false })
  permission: Permission;

  @Column({
    type: 'enum',
    enum: ScopeType,
  })
  scopeType: ScopeType;

  @ManyToOne(() => Tenant, { nullable: true })
  tenant?: Tenant;

  @ManyToOne(() => Branch, { nullable: true })
  branch?: Branch;
}
