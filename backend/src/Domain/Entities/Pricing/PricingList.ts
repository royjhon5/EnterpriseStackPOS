import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Entity, ManyToOne, OneToMany, Column, JoinColumn } from 'typeorm';
import { PriceListItem } from '../../../Domain/Entities/Pricing/PricingListItem';

@Entity('price_lists')
export class PriceList extends BaseEntity {
  @Column({ name: 'tenantId' })
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ name: 'branchId', nullable: true })
  branchId?: number | null;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo?: Date | null;

  @OneToMany(() => PriceListItem, (item) => item.priceList, {
    cascade: true,
  })
  items: PriceListItem[];
}
