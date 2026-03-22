// src/Application/Command/User/UpdateUserCommand.ts
import { Command } from '@nestjs/cqrs';
import { CommandResult } from '../../CommandResult';

export class ActivateUserCommand extends Command<CommandResult<string>> {
  constructor(public readonly id: string) {
    super();
  }
}
