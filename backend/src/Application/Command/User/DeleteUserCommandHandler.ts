// src/application/commands/tenants/delete-tenant.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeleteUserCommand } from '../../../Application/Command/User/DeleteUserCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { User } from '../../../Domain/Entities/User/User';
import { ValidationError } from '../../../Constants/ValidationError';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<
  DeleteUserCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<CommandResult<boolean>> {
    const user = await this.userRepo.findOne({
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
    user.isActive = true;

    await this.userRepo.save(user);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
