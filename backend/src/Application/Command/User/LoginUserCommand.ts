// src/user/commands/login-user.command.ts
import { ICommand } from '@nestjs/cqrs';
import { LoginCredentialsDTO } from '../../../Models/DTO/User/User';

export class LoginUserCommand implements ICommand {
  constructor(public readonly login: LoginCredentialsDTO) {}
}
