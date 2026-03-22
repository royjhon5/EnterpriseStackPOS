// src/Application/CommandResult.ts
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from '../Constants/ValidationError';

export class CommandResult<T> {
  validatorError?: ValidationError;
  statusCode: HttpStatus = HttpStatus.OK;
  response?: T;

  constructor(init?: Partial<CommandResult<T>>) {
    Object.assign(this, init);
  }

  get isSuccess(): boolean {
    return !this.validatorError;
  }
}
