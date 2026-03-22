// src/Application/Command/User/UpdateUserCommand.ts
import { Command } from '@nestjs/cqrs';
import { UpdateRoleDTO } from '../../../Models/DTO/Role/Role';
import { CommandResult } from '../../CommandResult';

export class UpdateRoleCommand extends Command<CommandResult<number>> {
  constructor(
    public readonly id: number,
    public readonly updateRoleDto: UpdateRoleDTO,
  ) {
    super();
  }
}
