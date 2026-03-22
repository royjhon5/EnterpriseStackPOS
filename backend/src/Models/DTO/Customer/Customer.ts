import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDTO {
  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ required: false, example: '+1-555-0100' })
  contactNo?: string;

  @ApiProperty({ required: false, example: 'jane@example.com' })
  email?: string;

  @ApiProperty({ required: false, example: 125 })
  loyaltyPoints?: number;
}

export class UpdateCustomerDTO {
  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ required: false, example: '+1-555-0100' })
  contactNo?: string;

  @ApiProperty({ required: false, example: 'jane@example.com' })
  email?: string;

  @ApiProperty({ required: false, example: 125 })
  loyaltyPoints?: number;
}

export class GetCustomerDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ required: false, example: '+1-555-0100' })
  contactNo?: string;

  @ApiProperty({ required: false, example: 'jane@example.com' })
  email?: string;

  @ApiProperty({ example: 125 })
  loyaltyPoints: number;
}
