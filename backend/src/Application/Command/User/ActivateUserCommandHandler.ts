// src/application/commands/tenants/delete-tenant.handler.ts
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivateUserCommand } from '../../../Application/Command/User/ActivateUserCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { User } from '../../../Domain/Entities/User/User';

@CommandHandler(ActivateUserCommand)
export class ActivateUserCommandHandler implements ICommandHandler<
  ActivateUserCommand,
  CommandResult<string>
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(command: ActivateUserCommand): Promise<CommandResult<string>> {
    const user = await this.userRepo.findOne({
      where: { id: command.id },
    });

    if (!user) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Record not found!';
      return new CommandResult<string>({
        response: 'Record Not Found',
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }
    user.isActive = true;

    await this.userRepo.save(user);

    return new CommandResult<string>({
      response: 'User Activate Successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
