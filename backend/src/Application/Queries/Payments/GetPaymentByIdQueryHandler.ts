import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Payment } from '../../../Domain/Entities/Transaction/Payment';
import { GetPaymentDTO } from '../../../Models/DTO/Transaction/Payment';
import { QueryResult } from '../../QueryResult';
import { GetPaymentByIdQuery } from './GetPaymentByIdQuery';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdQueryHandler implements IQueryHandler<
  GetPaymentByIdQuery,
  QueryResult<GetPaymentDTO>
> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async execute(
    query: GetPaymentByIdQuery,
  ): Promise<QueryResult<GetPaymentDTO>> {
    const result = new QueryResult<GetPaymentDTO>();

    const payment = await this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.sale', 'sale')
      .where('payment.id = :paymentId', { paymentId: query.paymentId })
      .andWhere('payment.saleId = :saleId', { saleId: query.saleId })
      .andWhere('payment.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere('sale.isDeleted = false')
      .getOne();

    if (!payment) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Payment not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: payment.id,
      saleId: payment.saleId,
      receiptNo: payment.sale?.receiptNo ?? '',
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount),
      referenceNo: payment.referenceNo,
      createdAt: payment.dateCreated.toISOString(),
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
