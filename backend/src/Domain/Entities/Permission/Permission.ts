import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Entity, Column, Index } from 'typeorm';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Index({ unique: true })
  @Column({ name: 'PermissionCode', type: 'varchar', length: 100 })
  permissionCode: string;

  @Column({ name: 'Description', type: 'varchar', length: 255, nullable: true })
  description?: string;
}
