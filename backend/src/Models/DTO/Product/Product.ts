import { BaseEntity } from 'src/Domain/Entities/BaseEntity/BaseEntity';
import { Category } from 'src/Domain/Entities/Category/Category';
import { ProductVariant } from 'src/Domain/Entities/Product/ProductVariant';
import { Tenant } from 'src/Domain/Entities/Tenant/Tenant';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity('products')
@Index(['tenantId', 'sku'], { unique: true })
export class Product extends BaseEntity {
  /* --------------------
   * Foreign Keys
   * -------------------- */

  @Column({ name: 'TenantID' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TenantID' })
  tenant: Tenant;

  @Column({ name: 'CategoryID' })
  categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  /* --------------------
   * Product Info
   * -------------------- */

  @Column({ name: 'SKU', type: 'varchar', length: 100 })
  sku: string;

  @Column({ name: 'ProductName', type: 'varchar', length: 255 })
  productName: string;

  @Column({ name: 'Description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive: boolean;
}
