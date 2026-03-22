// src/application/commands/tenants/delete-tenant.handler.ts
import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeActivateUserCommand } from '../../../Application/Command/User/DeActivateUserCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { User } from '../../../Domain/Entities/User/User';

@CommandHandler(DeActivateUserCommand)
export class DeActivateUserCommandHandler implements ICommandHandler<
  DeActivateUserCommand,
  CommandResult<string>
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(
    command: DeActivateUserCommand,
  ): Promise<CommandResult<string>> {
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
    user.isActive = false;

    await this.userRepo.save(user);

    return new CommandResult<string>({
      response: 'User DeActivate Successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
