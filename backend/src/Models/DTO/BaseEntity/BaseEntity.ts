import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  dateCreated: Date;

  @Column({ type: 'varchar', nullable: true })
  createdById?: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @Column({ type: 'varchar', nullable: true })
  lastModifiedById?: string;

  @Column({ type: 'varchar', nullable: true })
  lastModifiedBy?: string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  lastModifiedDate?: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
