import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../../../Domain/Entities/Accounting/Accounting';
import { ReferenceType } from '../../../Domain/Entities/Accounting/Journal';

export class CreateAccountDTO {
  @ApiProperty({ example: '1000' })
  accountCode: string;

  @ApiProperty({ example: 'Cash on Hand' })
  accountName: string;

  @ApiProperty({ enum: AccountType, example: AccountType.ASSET })
  accountType: AccountType;
}

export class UpdateAccountDTO {
  @ApiProperty({ example: '1000' })
  accountCode: string;

  @ApiProperty({ example: 'Cash on Hand' })
  accountName: string;

  @ApiProperty({ enum: AccountType, example: AccountType.ASSET })
  accountType: AccountType;
}

export class GetAccountDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ example: '1000' })
  accountCode: string;

  @ApiProperty({ example: 'Cash on Hand' })
  accountName: string;

  @ApiProperty({ enum: AccountType, example: AccountType.ASSET })
  accountType: AccountType;
}

export class CreateJournalLineDTO {
  @ApiProperty({ example: 1 })
  accountId: number;

  @ApiProperty({ example: 100, required: false })
  debit?: number;

  @ApiProperty({ example: 0, required: false })
  credit?: number;
}

export class CreateJournalEntryDTO {
  @ApiProperty({ enum: ReferenceType, example: ReferenceType.SALE })
  referenceType: ReferenceType;

  @ApiProperty({ example: 1001 })
  referenceId: number;

  @ApiProperty({ example: '2026-03-21T10:00:00.000Z', required: false })
  postedAt?: Date;

  @ApiProperty({ type: [CreateJournalLineDTO] })
  journalLines: CreateJournalLineDTO[];
}

export class GetJournalLineDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  journalEntryId: number;

  @ApiProperty({ example: 1 })
  accountId: number;

  @ApiProperty({ example: '1000' })
  accountCode: string;

  @ApiProperty({ example: 'Cash on Hand' })
  accountName: string;

  @ApiProperty({ example: 100 })
  debit: number;

  @ApiProperty({ example: 0 })
  credit: number;
}

export class GetJournalEntryDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tenantId: number;

  @ApiProperty({ enum: ReferenceType, example: ReferenceType.SALE })
  referenceType: ReferenceType;

  @ApiProperty({ example: 1001 })
  referenceId: number;

  @ApiProperty({ example: '2026-03-21T10:00:00.000Z' })
  postedAt: Date;

  @ApiProperty({ type: [GetJournalLineDTO] })
  journalLines: GetJournalLineDTO[];
}
