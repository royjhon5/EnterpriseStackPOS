import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { InventoryCount } from '../../../Domain/Entities/Inventory/InventoryCount';

@Entity('inventory_count_details')
export class InventoryCountDetail extends BaseEntity {
  @Column({ name: 'inventoryCountId' })
  inventoryCountId: number;

  @ManyToOne(() => InventoryCount, (count) => count.details, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventoryCountId' })
  inventoryCount: InventoryCount;

  @Column({ name: 'variantId' })
  variantId: number;

  @ManyToOne(() => ProductVariant, { nullable: false })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column('int')
  systemQty: number;

  @Column('int')
  countedQty: number;

  @Column('int')
  variance: number;
}
