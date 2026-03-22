import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../../Domain/Entities/Transaction/Payment';

export class CreatePaymentDTO {
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 39.98 })
  amount: number;

  @ApiProperty({ required: false, example: 'AUTH-12345' })
  referenceNo?: string;
}

export class GetPaymentDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 100 })
  saleId: number;

  @ApiProperty({ example: 'SALE-1710890000000' })
  receiptNo: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 39.98 })
  amount: number;

  @ApiProperty({ required: false, example: 'AUTH-12345' })
  referenceNo?: string;

  @ApiProperty({ example: '2026-03-20T12:00:00.000Z' })
  createdAt: string;
}
