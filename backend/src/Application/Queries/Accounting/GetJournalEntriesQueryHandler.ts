import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { JournalEntry } from '../../../Domain/Entities/Accounting/Journal';
import { GetJournalEntryDTO } from '../../../Models/DTO/Accounting/AccountingApi';
import { GetJournalEntriesQuery } from './GetJournalEntriesQuery';

@QueryHandler(GetJournalEntriesQuery)
export class GetJournalEntriesQueryHandler implements IQueryHandler<
  GetJournalEntriesQuery,
  QueryPageResult<GetJournalEntryDTO[]>
> {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
  ) {}

  async execute(
    query: GetJournalEntriesQuery,
  ): Promise<QueryPageResult<GetJournalEntryDTO[]>> {
    const result = new QueryPageResult<GetJournalEntryDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.journalRepo
      .createQueryBuilder('journal')
      .where('journal.isDeleted = false')
      .andWhere('journal.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(journal.referenceType LIKE :searchKey OR journal.referenceId LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('journal.postedAt', 'DESC')
      .addOrderBy('journal.id', 'DESC');

    const [journals, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = journals.map((journal) => ({
      id: journal.id,
      tenantId: journal.tenantId,
      referenceType: journal.referenceType,
      referenceId: journal.referenceId,
      postedAt: journal.postedAt,
      journalLines: [],
    }));
    result.statusCode = HttpStatus.OK;
    result.pageDetails = {
      totalCount,
      pageSize,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
      hasPrevious: currentPage > 1,
      hasNext: currentPage * pageSize < totalCount,
    };

    return result;
  }
}
