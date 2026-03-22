import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../../Domain/Entities/Transaction/Payment';
import { GetPaymentDTO } from '../../../Models/DTO/Transaction/Payment';
import { QueryPageResult } from '../../QueryPageResult';
import { GetPaymentsQuery } from './GetPaymentsQuery';

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsQueryHandler implements IQueryHandler<
  GetPaymentsQuery,
  QueryPageResult<GetPaymentDTO[]>
> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async execute(
    query: GetPaymentsQuery,
  ): Promise<QueryPageResult<GetPaymentDTO[]>> {
    const result = new QueryPageResult<GetPaymentDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.sale', 'sale')
      .where('payment.isDeleted = false')
      .andWhere('payment.saleId = :saleId', { saleId: query.saleId })
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere('sale.isDeleted = false')
      .orderBy('payment.dateCreated', 'DESC');

    const [payments, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = payments.map((payment) => ({
      id: payment.id,
      saleId: payment.saleId,
      receiptNo: payment.sale?.receiptNo ?? '',
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount),
      referenceNo: payment.referenceNo,
      createdAt: payment.dateCreated.toISOString(),
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
