import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ name: 'tenantId', nullable: true })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  contactNo?: string;

  @Column({ nullable: true })
  email?: string;

  @Column('int', { default: 0 })
  loyaltyPoints: number;
}
