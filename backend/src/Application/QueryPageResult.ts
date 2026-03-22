import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ExtendedPageDetails } from '../Models/ExtendedPageDetails';

export class QueryPageResult<T> {
  @ApiProperty({ required: false })
  validatorError?: any;

  get isSuccess(): boolean {
    return this.validatorError == null;
  }

  @ApiProperty({
    type: 'array',
    items: { oneOf: [] }, // will override in controller
    required: false,
  })
  response?: T;

  @ApiProperty({ example: HttpStatus.OK })
  statusCode: HttpStatus = HttpStatus.OK;

  @ApiProperty({ type: ExtendedPageDetails, required: false })
  pageDetails?: ExtendedPageDetails;
}
