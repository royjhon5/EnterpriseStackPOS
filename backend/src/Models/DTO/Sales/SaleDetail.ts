import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleLineDTO {
  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class GetSaleLineDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 5 })
  productId: number;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ example: 'SKU-1001' })
  sku: string;

  @ApiProperty({ example: '0123456789012' })
  barcode: string;

  @ApiProperty({ example: 'Bottle' })
  unit: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 19.99 })
  unitPrice: number;

  @ApiProperty({ example: 39.98 })
  lineTotal: number;

  @ApiProperty({ required: false, example: 1 })
  returnedQuantity?: number;

  @ApiProperty({ required: false, example: 1 })
  remainingReturnableQuantity?: number;

  @ApiProperty({ required: false, example: 19.99 })
  refundedAmount?: number;
}

