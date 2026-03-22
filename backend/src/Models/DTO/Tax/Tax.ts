import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tenant } from 'src/Domain/Entities/Tenant/Tenant';
import { SaleTax } from 'src/Domain/Entities/Tax/SaleTax';
import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';

@Entity('taxes')
export class Tax extends BaseEntity {
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
