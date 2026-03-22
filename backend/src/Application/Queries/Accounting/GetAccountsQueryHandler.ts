import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../Domain/Entities/Accounting/Accounting';
import { GetAccountDTO } from '../../../Models/DTO/Accounting/AccountingApi';
import { QueryPageResult } from '../../QueryPageResult';
import { GetAccountsQuery } from './GetAccountsQuery';

@QueryHandler(GetAccountsQuery)
export class GetAccountsQueryHandler implements IQueryHandler<
  GetAccountsQuery,
  QueryPageResult<GetAccountDTO[]>
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(
    query: GetAccountsQuery,
  ): Promise<QueryPageResult<GetAccountDTO[]>> {
    const result = new QueryPageResult<GetAccountDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.accountRepo
      .createQueryBuilder('account')
      .where('account.isDeleted = false')
      .andWhere('account.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(account.accountCode LIKE :searchKey OR account.accountName LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('account.accountCode', 'ASC');

    const [accounts, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = accounts.map((account) => ({
      id: account.id,
      tenantId: account.tenantId,
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
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
