import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @ApiProperty({ example: 'Beverages' })
  categoryName: string;
}

export class UpdateCategoryDTO {
  @ApiProperty({ example: 'Beverages' })
  categoryName: string;
}

export class GetCategoryDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 'Beverages' })
  categoryName: string;
}
