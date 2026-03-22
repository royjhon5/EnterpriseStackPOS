// src/Application/Command/User/CreateUserCommandHandler.ts
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CommandResult } from '../../CommandResult';
import { CreateUserCommand } from './CreateUserCommand';

import { Role } from '../../../Domain/Entities/Role/Role';
import { UserRole } from '../../../Domain/Entities/Role/UserRole';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { User } from '../../../Domain/Entities/User/User';
import { toValidationError } from '../../../Services/Validations/Props/ToValidationError';
import { Validator } from '../../../Services/Validations/Props/Validations';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<
  CreateUserCommand,
  CommandResult<string>
> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tenant) private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CommandResult<string>> {
    const dto = command.createUserDto;

    // 1) validate (your custom validator)
    const validator = new Validator();
    validator
      .isString(dto?.fullName ?? null, 'FirstName', true)
      .min(1)
      .max(30);
    validator
      .isString(dto?.email ?? null, 'Email', true)
      .isEmail()
      .min(1)
      .max(100);
    validator
      .isString(dto?.password ?? null, 'Password', true)
      .isAlphaNumericSymbol()
      .min(1)
      .max(30);

    if (validator.containsError()) {
      return new CommandResult<string>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    // 2) tenant check
    const tenant = await this.tenantRepo.findOne({
      where: { id: command.tenantId },
    });
    if (!tenant) {
      validator.isFailed('TenantId', 'Role/Tenant not found!', true);
      return new CommandResult<string>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    // 3) role check (Role.roleName, not name)
    const roleName = (command.role ?? '').toUpperCase().trim();
    const roleEntity = await this.roleRepo.findOne({ where: { roleName } });
    if (!roleEntity) {
      validator.isFailed('Role', 'Role not found.', true);
      return new CommandResult<string>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    // 4) optional: unique email check
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      validator.isFailed('Email', 'Email already exists.', true);
      return new CommandResult<string>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    // 5) hash password
    const passwordHash = await bcrypt.hash(dto.password as string, 10);

    // 6) create user (align with IdentityUser fields!)
    const user = this.userRepo.create({
      // These property names MUST match IdentityUser.
      // If your IdentityUser uses "userName" instead of "username", change it.
      userName: dto.email, // <-- likely correct (ASP.NET style)
      email: dto.email,
      passwordHash,
      tenantId: command.tenantId,

      // Your custom User columns
      fullName: `${dto.fullName}`,
      isActive: true,
      lastLogin: null,
    } as Partial<User>);

    const savedUser = await this.userRepo.save(user);

    // 7) create UserRole join row
    const userRole = this.userRoleRepo.create({
      userId: savedUser.id,
      roleId: roleEntity.id,
    } as Partial<UserRole>);

    await this.userRoleRepo.save(userRole);

    return new CommandResult<string>({
      statusCode: HttpStatus.ACCEPTED,
      response: savedUser.id,
    });
  }
}
