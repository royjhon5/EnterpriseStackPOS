// src/application/commands/tenants/delete-tenant.command.ts
import { Command } from '@nestjs/cqrs';
import { CommandResult } from '../../../Application/CommandResult';

export class DeleteRoleCommand extends Command<CommandResult<boolean>> {
  constructor(public readonly id: number) {
    super();
  }
}
