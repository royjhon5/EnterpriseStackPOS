import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from 'src/Domain/Entities/Tenant/Tenant';
import { Branch } from 'src/Domain/Entities/Branch/Branch';
import { Entity, ManyToOne, OneToMany, Column } from 'typeorm';
import { PriceListItem } from 'src/Domain/Entities/Pricing/PricingListItem';

@Entity('price_lists')
export class PriceList extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @ManyToOne(() => Branch, { nullable: true })
  branch?: Branch;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo?: Date;

  @OneToMany(() => PriceListItem, (item) => item.priceList, {
    cascade: true,
  })
  items: PriceListItem[];
}
