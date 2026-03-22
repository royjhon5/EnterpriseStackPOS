import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 35 })
  quantityOnHand: number;

  @ApiProperty({ example: 10 })
  reorderLevel: number;
}

export class UpdateInventoryDTO {
  @ApiProperty({ example: 35 })
  quantityOnHand: number;

  @ApiProperty({ example: 10 })
  reorderLevel: number;
}

export class GetInventoryDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

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

  @ApiProperty({ example: 35 })
  quantityOnHand: number;

  @ApiProperty({ example: 10 })
  reorderLevel: number;
}
