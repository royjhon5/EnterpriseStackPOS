import { HttpStatus } from '@nestjs/common';

export class ErrorResponse {
  statusCode: number = HttpStatus.BAD_REQUEST;
  title: string = 'Bad Request';
  message: string = 'Something is wrong with the request';
  payload: any = null;
  tag: string | null = null;
  type: string = 'Error';
}
