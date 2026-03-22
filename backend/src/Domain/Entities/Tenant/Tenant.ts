import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ name: 'TenantName', type: 'varchar', length: 255 })
  tenantName: string;

  @Column({ name: 'Code', type: 'varchar', length: 255 })
  code: string;

  @Column({ name: 'Name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'SubscriptionPlan', type: 'varchar', length: 100 })
  subscriptionPlan: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Branch, (branch) => branch.tenant)
  branches: Branch[];
}
