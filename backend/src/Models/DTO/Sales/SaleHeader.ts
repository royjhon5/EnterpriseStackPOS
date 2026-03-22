import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../../../Domain/Entities/Sales/SaleHeader';
import { GetSalesReturnDTO } from '../SalesReturn/SalesReturn';
import { GetPaymentDTO } from '../Transaction/Payment';
import { CreateSaleLineDTO, GetSaleLineDTO } from './SaleDetail';

export class CreateSaleDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ required: false, example: 20 })
  customerId?: number;

  @ApiProperty({ required: false, example: 0 })
  discountAmount?: number;

  @ApiProperty({ required: false, example: 0 })
  taxAmount?: number;

  @ApiProperty({ type: [CreateSaleLineDTO] })
  items: CreateSaleLineDTO[];
}

export class GetSaleDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 2 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: 'user-123' })
  cashierId: string;

  @ApiProperty({ example: 'Jane Cashier' })
  cashierName: string;

  @ApiProperty({ required: false, example: 20 })
  customerId?: number;

  @ApiProperty({ required: false, example: 'Jane Doe' })
  customerName?: string;

  @ApiProperty({ example: 'SALE-20260320-001' })
  receiptNo: string;

  @ApiProperty({ example: 39.98 })
  grossAmount: number;

  @ApiProperty({ example: 0 })
  discountAmount: number;

  @ApiProperty({ example: 0 })
  taxAmount: number;

  @ApiProperty({ example: 39.98 })
  netAmount: number;

  @ApiProperty({ example: 20 })
  totalPaid: number;

  @ApiProperty({ example: 19.98 })
  balanceDue: number;

  @ApiProperty({ example: 1 })
  paymentCount: number;

  @ApiProperty({ required: false, example: true })
  hasReturns?: boolean;

  @ApiProperty({ required: false, example: 1 })
  salesReturnCount?: number;

  @ApiProperty({ required: false, example: 1 })
  totalReturnedQuantity?: number;

  @ApiProperty({ required: false, example: 19.99 })
  totalRefundedAmount?: number;

  @ApiProperty({ required: false, example: 10 })
  refundableAmount?: number;

  @ApiProperty({ enum: SaleStatus, example: SaleStatus.PAID })
  status: SaleStatus;

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  saleDate: string;

  @ApiProperty({ example: 2 })
  itemCount: number;

  @ApiProperty({ type: [GetSaleLineDTO], required: false })
  items?: GetSaleLineDTO[];

  @ApiProperty({ type: [GetPaymentDTO], required: false })
  payments?: GetPaymentDTO[];

  @ApiProperty({ type: [GetSalesReturnDTO], required: false })
  salesReturns?: GetSalesReturnDTO[];
}
export class GetSalesSummaryDTO {
  @ApiProperty({ example: 25 })
  salesCount: number;

  @ApiProperty({ example: 999.99 })
  grossSales: number;

  @ApiProperty({ example: 950.5 })
  netSales: number;

  @ApiProperty({ example: 700 })
  totalPaid: number;

  @ApiProperty({ example: 250.5 })
  totalBalanceDue: number;

  @ApiProperty({ example: 4 })
  returnedSalesCount: number;

  @ApiProperty({ example: 8 })
  totalReturnedQuantity: number;

  @ApiProperty({ example: 120.5 })
  totalRefundedAmount: number;

  @ApiProperty({ example: 30 })
  totalRefundableAmount: number;

  @ApiProperty({ example: 1 })
  voidedCount: number;

  @ApiProperty({ example: 2 })
  refundedCount: number;

  @ApiProperty({ example: 10 })
  paidCount: number;

  @ApiProperty({ example: 6 })
  partiallyPaidCount: number;

  @ApiProperty({ example: 6 })
  pendingPaymentCount: number;

  @ApiProperty({ required: false, example: '2026-03-01T00:00:00.000Z' })
  dateFrom?: string;

  @ApiProperty({ required: false, example: '2026-03-31T00:00:00.000Z' })
  dateTo?: string;
}
