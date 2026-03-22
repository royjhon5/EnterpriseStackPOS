// src/application/commands/users/create-user.command.ts
import { Command } from '@nestjs/cqrs';
import { CreateUserDTO } from '../../../Models/DTO/User/User';
import { CommandResult } from '../../../Application/CommandResult';

export class CreateUserCommand extends Command<CommandResult<string>> {
  constructor(
    public readonly createUserDto: CreateUserDTO,
    public readonly tenantId: number,
    public readonly role: string,
  ) {
    super();
  }
}
