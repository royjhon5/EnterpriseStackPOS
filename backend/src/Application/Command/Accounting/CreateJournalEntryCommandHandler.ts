import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Account } from '../../../Domain/Entities/Accounting/Accounting';
import {
  JournalEntry,
  ReferenceType,
} from '../../../Domain/Entities/Accounting/Journal';
import { JournalLine } from '../../../Domain/Entities/Accounting/JournalLine';
import { CommandResult } from '../../CommandResult';
import { CreateJournalEntryCommand } from './CreateJournalEntryCommand';

@CommandHandler(CreateJournalEntryCommand)
export class CreateJournalEntryCommandHandler implements ICommandHandler<
  CreateJournalEntryCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(
    command: CreateJournalEntryCommand,
  ): Promise<CommandResult<number>> {
    const dto = command.journalEntry;

    if (!Object.values(ReferenceType).includes(dto.referenceType)) {
      return this.error('Reference type is invalid.');
    }

    if (!dto.journalLines?.length || dto.journalLines.length < 2) {
      return this.error('Journal entry must contain at least two lines.');
    }

    const accountIds = dto.journalLines.map((line) => line.accountId);
    const accounts = await this.accountRepo.find({
      where: {
        id: In(accountIds),
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (accounts.length !== accountIds.length) {
      return this.error('One or more accounts do not exist for this tenant.');
    }

    let totalDebit = 0;
    let totalCredit = 0;
    for (const line of dto.journalLines) {
      const debit = Number(line.debit ?? 0);
      const credit = Number(line.credit ?? 0);

      if (
        !Number.isFinite(debit) ||
        debit < 0 ||
        !Number.isFinite(credit) ||
        credit < 0
      ) {
        return this.error('Debit and credit values must be zero or greater.');
      }

      if ((debit === 0 && credit === 0) || (debit > 0 && credit > 0)) {
        return this.error(
          'Each journal line must have either a debit or a credit amount.',
        );
      }

      totalDebit += debit;
      totalCredit += credit;
    }

    if (Number(totalDebit.toFixed(2)) !== Number(totalCredit.toFixed(2))) {
      return this.error(
        'Journal entry must be balanced. Total debits must equal total credits.',
      );
    }

    const journalEntryId = await this.dataSource.transaction(
      async (manager) => {
        const journalRepo = manager.getRepository(JournalEntry);
        const journalLineRepo = manager.getRepository(JournalLine);

        const journalEntry = journalRepo.create({
          tenantId: command.tenantId,
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
          postedAt: dto.postedAt ?? new Date(),
        });
        await journalRepo.save(journalEntry);

        const lines = dto.journalLines.map((line) =>
          journalLineRepo.create({
            journalEntryId: journalEntry.id,
            accountId: line.accountId,
            debit: Number(line.debit ?? 0),
            credit: Number(line.credit ?? 0),
          }),
        );
        await journalLineRepo.save(lines);

        return journalEntry.id;
      },
    );

    return new CommandResult<number>({
      response: journalEntryId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private error(message: string): CommandResult<number> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<number>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
