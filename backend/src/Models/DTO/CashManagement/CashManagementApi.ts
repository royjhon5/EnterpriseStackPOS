import { ApiProperty } from '@nestjs/swagger';
import { CashSessionStatus } from '../../../Domain/Entities/CashManagement/CashManagement';
import { CashMovementType } from '../../../Domain/Entities/CashManagement/CashMovement';

export class OpenCashSessionDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'cashier-123' })
  cashierId: string;

  @ApiProperty({ example: 100 })
  openingBalance: number;
}

export class CloseCashSessionDTO {
  @ApiProperty({ example: 275.5 })
  closingBalance: number;
}

export class GetCashSessionDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: 'cashier-123' })
  cashierId: string;

  @ApiProperty({ example: 'Jane Cashier' })
  cashierName: string;

  @ApiProperty({ example: 100 })
  openingBalance: number;

  @ApiProperty({ example: 275.5, required: false })
  closingBalance?: number | null;

  @ApiProperty({ example: 280, required: false })
  expectedBalance?: number | null;

  @ApiProperty({ example: -4.5, required: false })
  variance?: number | null;

  @ApiProperty({ enum: CashSessionStatus, example: CashSessionStatus.OPEN })
  status: CashSessionStatus;

  @ApiProperty({ example: '2026-03-21T10:00:00.000Z' })
  openedAt: Date;

  @ApiProperty({ example: '2026-03-21T18:00:00.000Z', required: false })
  closedAt?: Date | null;
}

export class CreateCashMovementDTO {
  @ApiProperty({ enum: CashMovementType, example: CashMovementType.DROP })
  movementType: CashMovementType;

  @ApiProperty({ example: 25 })
  amount: number;

  @ApiProperty({ example: 'DROP-0001', required: false })
  referenceNo?: string;
}

export class GetCashMovementDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  sessionId: number;

  @ApiProperty({ enum: CashMovementType, example: CashMovementType.SALE })
  movementType: CashMovementType;

  @ApiProperty({ example: 25 })
  amount: number;

  @ApiProperty({ example: 'DROP-0001', required: false })
  referenceNo?: string | null;

  @ApiProperty({ example: '2026-03-21T11:00:00.000Z' })
  createdAt: Date;
}
