// src/Application/Command/User/UpdateUserCommandHandler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';

import { UpdateUserCommand } from './UpdateUserCommand';
import { CommandResult } from '../../CommandResult';

import { User } from '../../../Domain/Entities/User/User';
import { Role } from '../../../Domain/Entities/Role/Role';
import { UserRole } from '../../../Domain/Entities/Role/UserRole';
import { Validator } from '../../../Services/Validations/Props/Validations';
import { toValidationError } from 'src/Services/Validations/Props/ToValidationError';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<
  UpdateUserCommand,
  CommandResult<string>
> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<CommandResult<string>> {
    const dto = command.updateUserDto;
    const validator = new Validator();

    // 1) basic id check
    validator
      .isString(command.id ?? null, 'Id', true)
      .min(1)
      .max(100);

    // 2) validate only fields that are provided
    if (dto.fullName !== undefined) {
      validator
        .isString(dto.fullName ?? null, 'FullName', true)
        .min(1)
        .max(30);
    }

    if (dto.email !== undefined) {
      validator
        .isString(dto.email ?? null, 'Email', true)
        .isEmail()
        .min(1)
        .max(100);
    }

    if (dto.password !== undefined) {
      validator
        .isString(dto.password ?? null, 'Password', true)
        .isAlphaNumericSymbol()
        .min(1)
        .max(30);
    }

    if (dto.isActive !== undefined) {
      // If your Validator has isBoolean use it; otherwise just do a manual check
      const ok = typeof dto.isActive === 'boolean';
      if (!ok)
        validator.isFailed('IsActive', 'IsActive must be boolean.', true);
    }

    if (validator.containsError()) {
      return new CommandResult<string>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    // 3) find user scoped to tenant
    const user = await this.userRepo.findOne({
      where: { id: command.id as any },
    });

    if (!user) {
      validator.isFailed('User', 'User not found.', true);
      return new CommandResult<string>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: toValidationError(validator),
      });
    }

    // 4) if email changed, ensure unique
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existing && existing.id !== user.id) {
        validator.isFailed('Email', 'Email already exists.', true);
        return new CommandResult<string>({
          statusCode: HttpStatus.BAD_REQUEST,
          validatorError: toValidationError(validator),
        });
      }
      user.email = dto.email;

      // IMPORTANT: if you follow ASP.NET Identity style, userName typically mirrors email
      // Adjust property name to match your entity field: userName vs username
      (user as any).userName = dto.email;
    }

    // 5) patch other fields
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    // 6) password update
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.save(user);

    // 7) optional role update
    if (command.role && command.role.trim().length > 0) {
      const roleName = command.role.toUpperCase().trim();
      const roleEntity = await this.roleRepo.findOne({ where: { roleName } });

      if (!roleEntity) {
        validator.isFailed('Role', 'Role not found.', true);
        return new CommandResult<string>({
          statusCode: HttpStatus.BAD_REQUEST,
          validatorError: toValidationError(validator),
        });
      }

      // If you only allow ONE role per user:
      await this.userRoleRepo.delete({ userId: user.id as any });

      const newUserRole = this.userRoleRepo.create({
        userId: user.id,
        roleId: roleEntity.id,
      } as Partial<UserRole>);

      await this.userRoleRepo.save(newUserRole);
    }

    return new CommandResult<string>({
      statusCode: HttpStatus.OK,
      response: user.id,
    });
  }
}
