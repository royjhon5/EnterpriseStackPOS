import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('categories')
@Index(['tenantId', 'categoryName'], { unique: true })
export class Category extends BaseEntity {
  /* --------------------
   * Foreign Key
   * -------------------- */

  @Column({ name: 'TenantID' })
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'TenantID' })
  tenant: Tenant;

  /* --------------------
   * Category Info
   * -------------------- */

  @Column({ name: 'CategoryName', type: 'varchar', length: 255 })
  categoryName: string;
}
