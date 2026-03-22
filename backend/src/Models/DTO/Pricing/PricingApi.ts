import { ApiProperty } from '@nestjs/swagger';

export class PriceListItemInputDTO {
  @ApiProperty({ example: 10 })
  variantId: number;

  @ApiProperty({ example: 149.99 })
  sellingPrice: number;
}

export class CreatePriceListDTO {
  @ApiProperty({ example: 1 })
  branchId?: number | null;

  @ApiProperty({ example: '2026-03-21' })
  effectiveFrom: Date;

  @ApiProperty({ example: '2026-04-21', required: false })
  effectiveTo?: Date | null;

  @ApiProperty({ type: [PriceListItemInputDTO] })
  items: PriceListItemInputDTO[];
}

export class UpdatePriceListDTO {
  @ApiProperty({ example: 1, required: false })
  branchId?: number | null;

  @ApiProperty({ example: '2026-03-21' })
  effectiveFrom: Date;

  @ApiProperty({ example: '2026-04-21', required: false })
  effectiveTo?: Date | null;

  @ApiProperty({ type: [PriceListItemInputDTO] })
  items: PriceListItemInputDTO[];
}

export class GetPriceListItemDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  priceListId: number;

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

  @ApiProperty({ example: 149.99 })
  sellingPrice: number;
}

export class GetPriceListDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 1, required: false })
  branchId?: number | null;

  @ApiProperty({ example: 'Main Branch', required: false })
  branchName?: string | null;

  @ApiProperty({ example: '2026-03-21' })
  effectiveFrom: Date;

  @ApiProperty({ example: '2026-04-21', required: false })
  effectiveTo?: Date | null;

  @ApiProperty({ type: [GetPriceListItemDTO] })
  items: GetPriceListItemDTO[];
}
