import { ApiProperty } from '@nestjs/swagger';

export class ExtendedPageDetails {
  @ApiProperty({ example: 42 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: false })
  hasPrevious: boolean;

  @ApiProperty({ example: true })
  hasNext: boolean;
}
