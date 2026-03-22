import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { LoginUserCommand } from '../../Application/Command/User/LoginUserCommand';
import { LoginCredentialsDTO, LoginUserDTO } from '../../Models/DTO/User/User';
import { ValidationError } from '../../Constants/ValidationError';
import { LoginUserCommandResultDTO } from '../../Models/DTO/User/LoginUserCommandResultDTO';

@ApiTags('Authentication')
@Controller('auth')
@ApiExtraModels(LoginUserDTO, ValidationError, LoginUserCommandResultDTO)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginCredentialsDTO })
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(LoginUserCommandResultDTO) },
  })
  async login(
    @Body() body: LoginCredentialsDTO,
  ): Promise<LoginUserCommandResultDTO> {
    const result = await this.commandBus.execute(new LoginUserCommand(body));

    // Ensure swagger matches exactly: validatorError is {} on success
    return {
      validatorError: result.validatorError ?? ({} as any),
      isSuccess: result.isSuccess,
      statusCode: result.statusCode,
      response: result.response,
    };
  }
}
