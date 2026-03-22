import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class IdentityUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  userName?: string;

  @Column({ unique: true, nullable: true })
  normalizedUserName?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  normalizedEmail?: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ nullable: true })
  securityStamp?: string;

  @Column({ nullable: true })
  concurrencyStamp?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  phoneNumberConfirmed: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lockoutEnd?: Date;

  @Column({ default: true })
  lockoutEnabled: boolean;

  @Column({ default: 0 })
  accessFailedCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(userName?: string) {
    if (userName) {
      this.userName = userName;
    }

    this.securityStamp = crypto.randomUUID();
    this.concurrencyStamp = crypto.randomUUID();
  }

  toString(): string {
    return this.userName ?? '';
  }
}
