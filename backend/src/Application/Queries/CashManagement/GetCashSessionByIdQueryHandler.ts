import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';
import { GetCashSessionDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';
import { QueryResult } from '../../QueryResult';
import { GetCashSessionByIdQuery } from './GetCashSessionByIdQuery';

@QueryHandler(GetCashSessionByIdQuery)
export class GetCashSessionByIdQueryHandler implements IQueryHandler<
  GetCashSessionByIdQuery,
  QueryResult<GetCashSessionDTO>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
  ) {}

  async execute(
    query: GetCashSessionByIdQuery,
  ): Promise<QueryResult<GetCashSessionDTO>> {
    const result = new QueryResult<GetCashSessionDTO>();

    const session = await this.cashSessionRepo.findOne({
      where: {
        id: query.id,
        tenantId: query.tenantId,
        isDeleted: false,
      },
      relations: ['branch', 'cashier'],
    });

    if (!session) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Cash session not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: session.id,
      tenantId: session.tenantId,
      branchId: session.branchId,
      branchName: session.branch?.branchName ?? '',
      cashierId: session.cashierId,
      cashierName: session.cashier?.fullName ?? '',
      openingBalance: Number(session.openingBalance),
      closingBalance:
        session.closingBalance === null || session.closingBalance === undefined
          ? null
          : Number(session.closingBalance),
      expectedBalance:
        session.expectedBalance === null ||
        session.expectedBalance === undefined
          ? null
          : Number(session.expectedBalance),
      variance:
        session.variance === null || session.variance === undefined
          ? null
          : Number(session.variance),
      status: session.status,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
