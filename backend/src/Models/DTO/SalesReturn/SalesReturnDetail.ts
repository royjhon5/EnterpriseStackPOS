import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesReturnLineDTO {
  @ApiProperty({ example: 1 })
  saleDetailId: number;

  @ApiProperty({ example: 1 })
  quantity: number;
}

export class GetSalesReturnLineDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  saleDetailId: number;

  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ example: 'SKU-1001' })
  sku: string;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: 19.99 })
  refundAmount: number;
}
