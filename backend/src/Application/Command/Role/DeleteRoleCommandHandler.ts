// src/application/commands/tenants/delete-tenant.handler.ts
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteRoleCommand } from '../../../Application/Command/Role/DeleteRoleCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Role } from '../../../Domain/Entities/Role/Role';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleCommandHandler implements ICommandHandler<
  DeleteRoleCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<CommandResult<boolean>> {
    const user = await this.roleRepo.findOne({
      where: { id: command.id },
    });

    if (!user) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Record not found!';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    user.isDeleted = true;

    await this.roleRepo.save(user);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
