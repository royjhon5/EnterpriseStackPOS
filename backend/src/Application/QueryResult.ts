import { HttpStatus } from '@nestjs/common';
import { ValidationError } from '../Constants/ValidationError';

export class QueryResult<T> {
  validatorError?: ValidationError;
  get isSuccess(): boolean {
    return this.validatorError == null;
  }
  response?: T;
  statusCode: HttpStatus = HttpStatus.OK;
}
