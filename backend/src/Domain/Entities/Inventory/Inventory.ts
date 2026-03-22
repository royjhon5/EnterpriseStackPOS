import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('inventories')
@Unique(['variant', 'branch'])
export class Inventory extends BaseEntity {
  @Column({ nullable: true })
  variantId: number;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column({ nullable: true })
  branchId: number;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column('int', { default: 0 })
  quantityOnHand: number;

  @Column('int', { default: 0 })
  reorderLevel: number;
}
