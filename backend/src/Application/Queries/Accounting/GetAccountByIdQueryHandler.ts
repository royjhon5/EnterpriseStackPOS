import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Account } from '../../../Domain/Entities/Accounting/Accounting';
import { GetAccountDTO } from '../../../Models/DTO/Accounting/AccountingApi';
import { QueryResult } from '../../QueryResult';
import { GetAccountByIdQuery } from './GetAccountByIdQuery';

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdQueryHandler implements IQueryHandler<
  GetAccountByIdQuery,
  QueryResult<GetAccountDTO>
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(
    query: GetAccountByIdQuery,
  ): Promise<QueryResult<GetAccountDTO>> {
    const result = new QueryResult<GetAccountDTO>();
    const account = await this.accountRepo.findOne({
      where: { id: query.id, tenantId: query.tenantId, isDeleted: false },
    });

    if (!account) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Account not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: account.id,
      tenantId: account.tenantId,
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
