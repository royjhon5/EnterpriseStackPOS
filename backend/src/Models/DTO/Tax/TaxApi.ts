import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxDTO {
  @ApiProperty({ example: 'VAT' })
  taxName: string;

  @ApiProperty({ example: 15 })
  rate: number;
}

export class UpdateTaxDTO {
  @ApiProperty({ example: 'VAT' })
  taxName: string;

  @ApiProperty({ example: 15 })
  rate: number;
}

export class GetTaxDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 'VAT' })
  taxName: string;

  @ApiProperty({ example: 15 })
  rate: number;
}
