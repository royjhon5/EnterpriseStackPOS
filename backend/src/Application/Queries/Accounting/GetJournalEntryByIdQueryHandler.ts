import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { JournalEntry } from '../../../Domain/Entities/Accounting/Journal';
import { GetJournalEntryDTO } from '../../../Models/DTO/Accounting/AccountingApi';
import { QueryResult } from '../../QueryResult';
import { GetJournalEntryByIdQuery } from './GetJournalEntryByIdQuery';

@QueryHandler(GetJournalEntryByIdQuery)
export class GetJournalEntryByIdQueryHandler implements IQueryHandler<
  GetJournalEntryByIdQuery,
  QueryResult<GetJournalEntryDTO>
> {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
  ) {}

  async execute(
    query: GetJournalEntryByIdQuery,
  ): Promise<QueryResult<GetJournalEntryDTO>> {
    const result = new QueryResult<GetJournalEntryDTO>();

    const journal = await this.journalRepo
      .createQueryBuilder('journal')
      .leftJoinAndSelect('journal.journalLines', 'line')
      .leftJoinAndSelect('line.account', 'account')
      .where('journal.id = :id', { id: query.id })
      .andWhere('journal.isDeleted = false')
      .andWhere('journal.tenantId = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!journal) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Journal entry not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: journal.id,
      tenantId: journal.tenantId,
      referenceType: journal.referenceType,
      referenceId: journal.referenceId,
      postedAt: journal.postedAt,
      journalLines:
        journal.journalLines?.map((line) => ({
          id: line.id,
          journalEntryId: line.journalEntryId,
          accountId: line.accountId,
          accountCode: line.account?.accountCode ?? '',
          accountName: line.account?.accountName ?? '',
          debit: Number(line.debit),
          credit: Number(line.credit),
        })) ?? [],
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
