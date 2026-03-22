import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDTO } from '../User/User';
import { ValidationError } from '../../../Constants/ValidationError';

export class LoginUserCommandResultDTO {
  @ApiProperty({ type: ValidationError, nullable: true })
  validatorError?: ValidationError;

  @ApiProperty({ example: true })
  isSuccess: boolean;

  @ApiProperty({ example: 100 })
  statusCode: number;

  @ApiProperty({ type: LoginUserDTO, nullable: true })
  response?: LoginUserDTO;
}
