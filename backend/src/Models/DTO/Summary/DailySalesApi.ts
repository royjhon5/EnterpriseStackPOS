import { ApiProperty } from '@nestjs/swagger';

export class GenerateDailySalesSummariesDTO {
  @ApiProperty({ example: '2026-03-01' })
  dateFrom: string;

  @ApiProperty({ example: '2026-03-31' })
  dateTo: string;

  @ApiProperty({ example: 1, required: false })
  branchId?: number;
}

export class GetDailySalesSummaryDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: '2026-03-21' })
  salesDate: string;

  @ApiProperty({ example: 1200.5 })
  totalSales: number;

  @ApiProperty({ example: 120.5 })
  totalTax: number;

  @ApiProperty({ example: 50 })
  totalDiscount: number;
}
