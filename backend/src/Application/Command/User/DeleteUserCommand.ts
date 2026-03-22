// src/application/commands/tenants/delete-tenant.command.ts
import { Command } from '@nestjs/cqrs';
import { CommandResult } from '../../../Application/CommandResult';

export class DeleteUserCommand extends Command<CommandResult<boolean>> {
  constructor(public readonly id: string) {
    super();
  }
}
