// src/Application/Command/User/UpdateUserCommand.ts
import { Command } from '@nestjs/cqrs';
import { CommandResult } from '../../CommandResult';
import { UpdateUserDTO } from '../../../Models/DTO/User/User';

export class UpdateUserCommand extends Command<CommandResult<string>> {
  constructor(
    public readonly id: string,
    public readonly updateUserDto: UpdateUserDTO,
    public readonly role?: string,
  ) {
    super();
  }
}
