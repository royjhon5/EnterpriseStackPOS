import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';
import { GetCashSessionDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';
import { QueryPageResult } from '../../QueryPageResult';
import { GetCashSessionsQuery } from './GetCashSessionsQuery';

@QueryHandler(GetCashSessionsQuery)
export class GetCashSessionsQueryHandler implements IQueryHandler<
  GetCashSessionsQuery,
  QueryPageResult<GetCashSessionDTO[]>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
  ) {}

  async execute(
    query: GetCashSessionsQuery,
  ): Promise<QueryPageResult<GetCashSessionDTO[]>> {
    const result = new QueryPageResult<GetCashSessionDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.cashSessionRepo
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.branch', 'branch')
      .leftJoinAndSelect('session.cashier', 'cashier')
      .where('session.isDeleted = false')
      .andWhere('session.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(branch.branchName LIKE :searchKey OR cashier.fullName LIKE :searchKey OR session.status LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('session.openedAt', 'DESC');

    const [sessions, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = sessions.map((session) => ({
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
