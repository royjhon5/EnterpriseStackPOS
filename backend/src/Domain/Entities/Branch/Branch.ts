import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { User } from '../../../Domain/Entities/User/User';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('branches')
export class Branch extends BaseEntity {
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TenantID' })
  tenant: Tenant;

  @Column({ name: 'BranchName', type: 'varchar', length: 255 })
  branchName: string;

  @Column({ name: 'Address', type: 'varchar', length: 500 })
  address: string;

  @Column({ name: 'ContactNo', type: 'varchar', length: 50 })
  contactNo: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.branch)
  users: User[];
}
