import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from 'src/Domain/Entities/Branch/Branch';
import { InventoryCountDetail } from 'src/Domain/Entities/Inventory/InventoryCountDetail';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

export enum InventoryCountStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('inventory_counts')
export class InventoryCount extends BaseEntity {
  @ManyToOne(() => Branch, { nullable: false })
  branch: Branch;

  @Column({ type: 'date' })
  countDate: Date;

  @Column({
    type: 'enum',
    enum: InventoryCountStatus,
    default: InventoryCountStatus.DRAFT,
  })
  status: InventoryCountStatus;

  @OneToMany(() => InventoryCountDetail, (detail) => detail.inventoryCount, {
    cascade: true,
  })
  details: InventoryCountDetail[];
}
