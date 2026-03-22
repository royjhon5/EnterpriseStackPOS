import { BaseEntity } from '../../../Domain/Entities/BaseEntity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity('app_settings')
export class AppSettings extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  headerColor?: string;

  @Column({ type: 'varchar', nullable: true })
  headerLogo?: string;

  @Column({ type: 'varchar', nullable: true })
  primaryColor?: string;

  @Column({ type: 'varchar', nullable: true })
  secondaryColor?: string;

  @Column({ type: 'varchar', nullable: true })
  tertiaryColor?: string;

  @Column({ type: 'varchar', nullable: true })
  footerColor?: string;

  @Column({ type: 'varchar', nullable: true })
  footerLogo?: string;

  @Column({ type: 'varchar', nullable: true })
  favicon?: string;

  @Column({ type: 'varchar', nullable: true })
  websiteTitle?: string;

  @Column({ type: 'text', nullable: true })
  termsAndCondition?: string;

  @Column({ type: 'text', nullable: true })
  privacyPolicy?: string;

  @Column({ type: 'varchar', nullable: true })
  contactNumber?: string;

  @Column({ type: 'varchar', nullable: true })
  emailAddress?: string;
}
