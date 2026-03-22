import { HttpStatus } from '@nestjs/common';

export class ErrorObjectResult<T = any> {
  constructor(
    public readonly error: T,
    public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {}
}
