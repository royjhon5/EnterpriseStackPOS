import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { DailySalesSummary } from '../../../Domain/Entities/Summary/DailySales';
import { GetDailySalesSummaryDTO } from '../../../Models/DTO/Summary/DailySalesApi';
import { QueryPageResult } from '../../QueryPageResult';
import { GetDailySalesSummariesQuery } from './GetDailySalesSummariesQuery';

@QueryHandler(GetDailySalesSummariesQuery)
export class GetDailySalesSummariesQueryHandler implements IQueryHandler<
  GetDailySalesSummariesQuery,
  QueryPageResult<GetDailySalesSummaryDTO[]>
> {
  constructor(
    @InjectRepository(DailySalesSummary)
    private readonly summaryRepo: Repository<DailySalesSummary>,
  ) {}

  async execute(
    query: GetDailySalesSummariesQuery,
  ): Promise<QueryPageResult<GetDailySalesSummaryDTO[]>> {
    const result = new QueryPageResult<GetDailySalesSummaryDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const parsedDateFrom = this.parseDate(query.dateFrom, 'dateFrom');
    if (parsedDateFrom instanceof ValidationError) {
      result.statusCode = HttpStatus.BAD_REQUEST;
      result.validatorError = parsedDateFrom;
      return result;
    }

    const parsedDateTo = this.parseDate(query.dateTo, 'dateTo');
    if (parsedDateTo instanceof ValidationError) {
      result.statusCode = HttpStatus.BAD_REQUEST;
      result.validatorError = parsedDateTo;
      return result;
    }

    const qb = this.summaryRepo
      .createQueryBuilder('summary')
      .leftJoinAndSelect('summary.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('summary.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .orderBy('summary.salesDate', 'DESC')
      .addOrderBy('summary.id', 'DESC');

    if (parsedDateFrom) {
      qb.andWhere('summary.salesDate >= :dateFrom', {
        dateFrom: parsedDateFrom.toISOString().slice(0, 10),
      });
    }

    if (parsedDateTo) {
      qb.andWhere('summary.salesDate <= :dateTo', {
        dateTo: parsedDateTo.toISOString().slice(0, 10),
      });
    }

    if (query.branchId) {
      qb.andWhere('summary.branchId = :branchId', { branchId: query.branchId });
    }

    const [summaries, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = summaries.map((summary) => ({
      id: summary.id,
      branchId: summary.branchId,
      branchName: summary.branch?.branchName ?? '',
      salesDate: summary.salesDate,
      totalSales: Number(summary.totalSales),
      totalTax: Number(summary.totalTax),
      totalDiscount: Number(summary.totalDiscount),
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

  private parseDate(
    value: string | undefined,
    fieldName: string,
  ): Date | ValidationError | undefined {
    if (!value) {
      return undefined;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = `${fieldName} must be a valid date string.`;
      return error;
    }

    return parsed;
  }
}
