import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RolePermissionCommand } from '../../../Application/Command/Role/RolePermissionCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Permission } from '../../../Domain/Entities/Permission/Permission';
import { Role } from '../../../Domain/Entities/Role/Role';
import { RolePermission } from '../../../Domain/Entities/Role/RolePermission';

@CommandHandler(RolePermissionCommand)
export class RolePermissionCommandHandler implements ICommandHandler<
  RolePermissionCommand,
  CommandResult<number[]>
> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  async execute(
    command: RolePermissionCommand,
  ): Promise<CommandResult<number[]>> {
    const { roleId, permissionIds } = command.payload;

    const role = await this.roleRepo.findOne({
      where: { id: roleId, isDeleted: false },
    });

    if (!role) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Role not found.';
      return new CommandResult<number[]>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    const uniquePermissionIds = [
      ...new Set((permissionIds ?? []).map(Number)),
    ].filter((value) => Number.isInteger(value) && value > 0);

    const permissions = uniquePermissionIds.length
      ? await this.permissionRepo.find({
          where: { id: In(uniquePermissionIds), isDeleted: false },
        })
      : [];

    if (permissions.length !== uniquePermissionIds.length) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'One or more permissions are invalid.';
      return new CommandResult<number[]>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const existing = await this.rolePermissionRepo.find({ where: { roleId } });
    if (existing.length) {
      await this.rolePermissionRepo.remove(existing);
    }

    if (!permissions.length) {
      return new CommandResult<number[]>({
        response: [],
        statusCode: HttpStatus.OK,
      });
    }

    const saved = await this.rolePermissionRepo.save(
      permissions.map((permission) =>
        this.rolePermissionRepo.create({
          roleId,
          permissionId: permission.id,
        }),
      ),
    );

    return new CommandResult<number[]>({
      response: saved.map((item) => item.permissionId),
      statusCode: HttpStatus.OK,
    });
  }
}
