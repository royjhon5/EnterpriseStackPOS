import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeletePermissionCommand } from '../../../Application/Command/Permission/DeletePermissionCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Permission } from '../../../Domain/Entities/Permission/Permission';

@CommandHandler(DeletePermissionCommand)
export class DeletePermissionCommandHandler implements ICommandHandler<
  DeletePermissionCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async execute(
    command: DeletePermissionCommand,
  ): Promise<CommandResult<boolean>> {
    const permission = await this.permissionRepo.findOne({
      where: { id: command.id, isDeleted: false },
    });

    if (!permission) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Permission not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    permission.isDeleted = true;
    permission.lastModifiedDate = new Date();

    await this.permissionRepo.save(permission);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
