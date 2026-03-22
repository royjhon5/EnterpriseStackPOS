import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDTO {
  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: 'SKU-1001' })
  sku: string;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ required: false, example: 'Carbonated soft drink' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UpdateProductDTO {
  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: 'SKU-1001' })
  sku: string;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ required: false, example: 'Carbonated soft drink' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class GetProductDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: 'Beverages' })
  categoryName: string;

  @ApiProperty({ example: 'SKU-1001' })
  sku: string;

  @ApiProperty({ example: 'Cola 1L' })
  productName: string;

  @ApiProperty({ required: false, example: 'Carbonated soft drink' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
