import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { SalesReturn } from '../../../Domain/Entities/SalesReturn/SalesReturn';
import { GetSalesSummaryDTO } from '../../../Models/DTO/Sales/SaleHeader';
import { QueryResult } from '../../QueryResult';
import { GetSalesSummaryQuery } from './GetSalesSummaryQuery';

@QueryHandler(GetSalesSummaryQuery)
export class GetSalesSummaryQueryHandler implements IQueryHandler<
  GetSalesSummaryQuery,
  QueryResult<GetSalesSummaryDTO>
> {
  constructor(
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
  ) {}

  async execute(
    query: GetSalesSummaryQuery,
  ): Promise<QueryResult<GetSalesSummaryDTO>> {
    const result = new QueryResult<GetSalesSummaryDTO>();

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

    if (parsedDateFrom && parsedDateTo && parsedDateFrom > parsedDateTo) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'dateFrom must be earlier than or equal to dateTo.';
      result.statusCode = HttpStatus.BAD_REQUEST;
      result.validatorError = error;
      return result;
    }

    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.payments', 'payments')
      .where('sale.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId });

    if (parsedDateFrom) {
      qb.andWhere('sale.saleDate >= :dateFrom', {
        dateFrom: this.startOfDay(parsedDateFrom),
      });
    }

    if (parsedDateTo) {
      qb.andWhere('sale.saleDate <= :dateTo', {
        dateTo: this.endOfDay(parsedDateTo),
      });
    }

    const sales = await qb.getMany();
    const saleIds = sales.map((sale) => sale.id);
    const salesReturns = saleIds.length
      ? await this.salesReturnRepo.find({
          where: { saleId: In(saleIds), isDeleted: false },
          relations: { details: true },
        })
      : [];

    let grossSales = 0;
    let netSales = 0;
    let totalPaid = 0;
    let totalBalanceDue = 0;
    let voidedCount = 0;
    let refundedCount = 0;
    let paidCount = 0;
    let partiallyPaidCount = 0;
    let pendingPaymentCount = 0;
    let totalRefundableAmount = 0;

    for (const sale of sales) {
      const saleNetAmount = Number(sale.netAmount);
      const salePaid = Number(
        (sale.payments ?? [])
          .reduce((sum, payment) => sum + Number(payment.amount), 0)
          .toFixed(2),
      );
      const saleBalanceDue = [SaleStatus.VOIDED, SaleStatus.REFUNDED].includes(
        sale.status,
      )
        ? 0
        : Number(Math.max(saleNetAmount - salePaid, 0).toFixed(2));

      grossSales = Number((grossSales + Number(sale.grossAmount)).toFixed(2));
      netSales = Number((netSales + saleNetAmount).toFixed(2));
      totalPaid = Number((totalPaid + salePaid).toFixed(2));
      totalBalanceDue = Number((totalBalanceDue + saleBalanceDue).toFixed(2));
      totalRefundableAmount = Number(
        (
          totalRefundableAmount + Math.max(Math.min(salePaid, saleNetAmount), 0)
        ).toFixed(2),
      );

      switch (sale.status) {
        case SaleStatus.VOIDED:
          voidedCount += 1;
          break;
        case SaleStatus.REFUNDED:
          refundedCount += 1;
          break;
        case SaleStatus.PAID:
          paidCount += 1;
          break;
        case SaleStatus.PARTIALLY_PAID:
          partiallyPaidCount += 1;
          break;
        case SaleStatus.PENDING_PAYMENT:
          pendingPaymentCount += 1;
          break;
      }
    }

    const returnedSalesCount = new Set(
      salesReturns.map((salesReturn) => salesReturn.saleId),
    ).size;
    const totalReturnedQuantity = salesReturns.reduce(
      (sum, salesReturn) =>
        sum +
        (salesReturn.details ?? []).reduce(
          (detailSum, detail) => detailSum + detail.quantity,
          0,
        ),
      0,
    );
    const totalRefundedAmount = Number(
      salesReturns
        .reduce((sum, salesReturn) => sum + Number(salesReturn.totalRefund), 0)
        .toFixed(2),
    );
    totalRefundableAmount = Number(
      Math.max(totalRefundableAmount - totalRefundedAmount, 0).toFixed(2),
    );

    result.response = {
      salesCount: sales.length,
      grossSales,
      netSales,
      totalPaid,
      totalBalanceDue,
      returnedSalesCount,
      totalReturnedQuantity,
      totalRefundedAmount,
      totalRefundableAmount,
      voidedCount,
      refundedCount,
      paidCount,
      partiallyPaidCount,
      pendingPaymentCount,
      dateFrom: parsedDateFrom?.toISOString(),
      dateTo: parsedDateTo?.toISOString(),
    };
    result.statusCode = HttpStatus.OK;

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

  private startOfDay(date: Date): Date {
    const value = new Date(date);
    value.setUTCHours(0, 0, 0, 0);
    return value;
  }

  private endOfDay(date: Date): Date {
    const value = new Date(date);
    value.setUTCHours(23, 59, 59, 999);
    return value;
  }
}
