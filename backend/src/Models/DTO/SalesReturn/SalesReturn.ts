import { ApiProperty } from '@nestjs/swagger';
import {
  CreateSalesReturnLineDTO,
  GetSalesReturnLineDTO,
} from './SalesReturnDetail';

export class CreateSalesReturnDTO {
  @ApiProperty({ example: 100 })
  saleId: number;

  @ApiProperty({ example: 'DAMAGED_ITEM' })
  reasonCode: string;

  @ApiProperty({ type: [CreateSalesReturnLineDTO] })
  items: CreateSalesReturnLineDTO[];
}

export class GetSalesReturnDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 100 })
  saleId: number;

  @ApiProperty({ example: 'SALE-1710890000000' })
  receiptNo: string;

  @ApiProperty({ example: 2 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: 'user-123' })
  processedById: string;

  @ApiProperty({ example: 'Jane Cashier' })
  processedByName: string;

  @ApiProperty({ example: 'DAMAGED_ITEM' })
  reasonCode: string;

  @ApiProperty({ example: 19.99 })
  totalRefund: number;

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  returnDate: string;

  @ApiProperty({ example: 1 })
  itemCount: number;

  @ApiProperty({ type: [GetSalesReturnLineDTO], required: false })
  items?: GetSalesReturnLineDTO[];
}
