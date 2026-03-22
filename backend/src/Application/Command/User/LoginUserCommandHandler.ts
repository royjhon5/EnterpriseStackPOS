// src/user/commands/handlers/login-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { LoginUserCommand } from '../../../Application/Command/User/LoginUserCommand';
import { AuthService } from '../../../Services/AuthService/AuthService';
import { LoginUserDTO } from '../../../Models/DTO/User/User';
import { UserService } from '../../../Application/Command/User/UserService';
import { CommandResult } from '../../../Application/CommandResult';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<
  LoginUserCommand,
  CommandResult<LoginUserDTO>
> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<CommandResult<LoginUserDTO>> {
    const { UserName, Password } = command.login;
    const result = new CommandResult<LoginUserDTO>();
    // Basic validation
    if (!UserName || UserName.length > 25) {
      throw new BadRequestException(
        'Username is required and max 25 characters.',
      );
    }
    if (!Password || Password.length > 75) {
      throw new BadRequestException(
        'Password is required and max 75 characters.',
      );
    }

    // Find user by username
    const user = await this.userService.findByUsername(UserName);
    if (!user) {
      throw new BadRequestException('User not found!');
    }

    // Check password
    const isPasswordValid = await this.userService.checkPassword(
      user,
      Password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password.');
    }

    // Check email confirmation
    if (!user.emailConfirmed) {
      throw new ForbiddenException(
        'Please confirm your email before signing in.',
      );
    }

    // Check roles
    const roles = await this.userService.getRoles(user.id);
    if (!roles || roles.length === 0) {
      throw new BadRequestException('User role not found!');
    }

    // Check account status
    if (!user.isActive) {
      throw new ForbiddenException('Your account is currently disabled!');
    }

    // Generate JWT
    const roleType = roles[0];
    const token = this.authService.generateJwtToken(
      user.id,
      roleType,
      user.tenantId,
    );

    result.response = {
      TenantId: user.tenantId,
      UserId: user.id,
      Token: token,
      FullName: user.fullName,
      Email: user.email,
      RoleType: roleType,
      phoneNumber: user.phoneNumber ?? '',
    };

    result.statusCode = 100;
    return result;
  }
}
//
