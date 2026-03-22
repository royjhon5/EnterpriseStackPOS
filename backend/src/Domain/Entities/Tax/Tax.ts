import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { SaleTax } from '../../../Domain/Entities/Tax/SaleTax';
import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';

@Entity('taxes')
@Index(['tenantId', 'taxName'], { unique: true })
export class Tax extends BaseEntity {
  @Column({ name: 'tenantId', nullable: true })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  taxName: string;

  @Column('decimal', { precision: 5, scale: 2 })
  rate: number;

  // Optional but recommended
  @OneToMany(() => SaleTax, (saleTax) => saleTax.tax)
  saleTaxes: SaleTax[];
}
