import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { DailySalesSummary } from '../../../Domain/Entities/Summary/DailySales';
import { GetDailySalesSummaryDTO } from '../../../Models/DTO/Summary/DailySalesApi';
import { QueryResult } from '../../QueryResult';
import { GetDailySalesSummaryByIdQuery } from './GetDailySalesSummaryByIdQuery';

@QueryHandler(GetDailySalesSummaryByIdQuery)
export class GetDailySalesSummaryByIdQueryHandler implements IQueryHandler<
  GetDailySalesSummaryByIdQuery,
  QueryResult<GetDailySalesSummaryDTO>
> {
  constructor(
    @InjectRepository(DailySalesSummary)
    private readonly summaryRepo: Repository<DailySalesSummary>,
  ) {}

  async execute(
    query: GetDailySalesSummaryByIdQuery,
  ): Promise<QueryResult<GetDailySalesSummaryDTO>> {
    const result = new QueryResult<GetDailySalesSummaryDTO>();

    const summary = await this.summaryRepo
      .createQueryBuilder('summary')
      .leftJoinAndSelect('summary.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('summary.id = :id', { id: query.id })
      .andWhere('summary.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!summary) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Daily sales summary not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: summary.id,
      branchId: summary.branchId,
      branchName: summary.branch?.branchName ?? '',
      salesDate: summary.salesDate,
      totalSales: Number(summary.totalSales),
      totalTax: Number(summary.totalTax),
      totalDiscount: Number(summary.totalDiscount),
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
