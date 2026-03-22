import { ApiProperty } from '@nestjs/swagger';
import { InventoryCountStatus } from '../../../Domain/Entities/Inventory/InventoryCount';

export class CreateInventoryCountDetailDTO {
  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 32 })
  countedQty: number;
}

export class CreateInventoryCountDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: '2026-03-21' })
  countDate: Date;

  @ApiProperty({ type: [CreateInventoryCountDetailDTO] })
  details: CreateInventoryCountDetailDTO[];
}

export class GetInventoryCountDetailDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  inventoryCountId: number;

  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 5 })
  productId: number;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ example: '0123456789012' })
  barcode: string;

  @ApiProperty({ example: 'Bottle' })
  unit: string;

  @ApiProperty({ example: 30 })
  systemQty: number;

  @ApiProperty({ example: 32 })
  countedQty: number;

  @ApiProperty({ example: 2 })
  variance: number;
}

export class GetInventoryCountDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: '2026-03-21' })
  countDate: Date;

  @ApiProperty({
    enum: InventoryCountStatus,
    example: InventoryCountStatus.DRAFT,
  })
  status: InventoryCountStatus;

  @ApiProperty({ type: [GetInventoryCountDetailDTO] })
  details: GetInventoryCountDetailDTO[];
}
