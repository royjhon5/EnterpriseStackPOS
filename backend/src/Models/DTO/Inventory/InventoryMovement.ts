import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '../../../Domain/Entities/Inventory/InventoryMovement';

export class CreateInventoryMovementDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ enum: MovementType, example: MovementType.IN })
  movementType: MovementType;

  @ApiProperty({
    example: 5,
    description: 'Use a negative quantity only for ADJUSTMENT decreases.',
  })
  quantity: number;

  @ApiProperty({ required: false, example: 'PO-1001' })
  referenceNo?: string;
}

export class GetInventoryMovementDTO {
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

  @ApiProperty({ enum: MovementType, example: MovementType.IN })
  movementType: MovementType;

  @ApiProperty({ example: 5 })
  quantity: number;

  @ApiProperty({ required: false, example: 'PO-1001' })
  referenceNo?: string;

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  createdAt: string;
}
