import { ApiProperty } from '@nestjs/swagger';

export class CreatePOSDeviceDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'POS-001' })
  deviceCode: string;

  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}

export class UpdatePOSDeviceDTO {
  @ApiProperty({ example: 'POS-001' })
  deviceCode: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-03-21T09:00:00.000Z', required: false })
  lastSyncAt?: Date | null;
}

export class GetPOSDeviceDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: 'POS-001' })
  deviceCode: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-03-21T09:00:00.000Z', required: false })
  lastSyncAt?: Date | null;
}

export class OpenShiftDTO {
  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'cashier-123' })
  userId: string;

  @ApiProperty({ example: '2026-03-21T08:00:00.000Z', required: false })
  startTime?: Date;
}

export class CloseShiftDTO {
  @ApiProperty({ example: '2026-03-21T17:00:00.000Z', required: false })
  endTime?: Date;
}

export class GetShiftDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ example: 'Main Branch' })
  branchName: string;

  @ApiProperty({ example: 'cashier-123' })
  userId: string;

  @ApiProperty({ example: 'Jane Cashier' })
  userName: string;

  @ApiProperty({ example: '2026-03-21T08:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2026-03-21T17:00:00.000Z', required: false })
  endTime?: Date | null;

  @ApiProperty({ example: true })
  isOpen: boolean;
}
