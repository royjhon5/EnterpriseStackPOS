import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePermissionCommand } from '../../../Application/Command/Permission/CreatePermissionCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Permission } from '../../../Domain/Entities/Permission/Permission';

@CommandHandler(CreatePermissionCommand)
export class CreatePermissionCommandHandler implements ICommandHandler<
  CreatePermissionCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async execute(
    command: CreatePermissionCommand,
  ): Promise<CommandResult<number>> {
    const code = command.permission.permissionCode?.trim();
    const description = command.permission.description?.trim() || null;

    if (!code) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Permission code is required.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const existing = await this.permissionRepo.findOne({
      where: { permissionCode: code },
    });

    if (existing) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'Permission code already exists.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    const permission = this.permissionRepo.create({
      permissionCode: code,
      description: description ?? undefined,
    });

    const saved = await this.permissionRepo.save(permission);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.CREATED,
    });
  }
}
