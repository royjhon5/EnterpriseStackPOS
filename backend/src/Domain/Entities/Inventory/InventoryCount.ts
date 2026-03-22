import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { InventoryCountDetail } from '../../../Domain/Entities/Inventory/InventoryCountDetail';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum InventoryCountStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('inventory_counts')
export class InventoryCount extends BaseEntity {
  @Column({ name: 'branchId' })
  branchId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branchId' })
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
