import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { ProductVariant } from 'src/Domain/Entities/Product/ProductVariant';
import { InventoryCount } from 'src/Domain/Entities/Inventory/InventoryCount';

@Entity('inventory_count_details')
export class InventoryCountDetail extends BaseEntity {
  @ManyToOne(() => InventoryCount, (count) => count.details, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  inventoryCount: InventoryCount;

  @ManyToOne(() => ProductVariant, { nullable: false })
  variant: ProductVariant;

  @Column('int')
  systemQty: number;

  @Column('int')
  countedQty: number;

  @Column('int')
  variance: number;
}
