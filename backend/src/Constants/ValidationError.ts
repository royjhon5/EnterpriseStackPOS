import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './error';

export class ValidationError extends ErrorResponse {
  constructor(statusCode: number = HttpStatus.BAD_REQUEST) {
    super();
    this.statusCode = statusCode;
    this.title = 'Validation Failed';
    this.message = 'The form contains invalid fields';
  }
}
