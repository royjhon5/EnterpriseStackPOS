import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { SalesReturn } from '../../../Domain/Entities/SalesReturn/SalesReturn';
import { GetSalesReturnDTO } from '../../../Models/DTO/SalesReturn/SalesReturn';
import { QueryResult } from '../../QueryResult';
import { GetSalesReturnByIdQuery } from './GetSalesReturnByIdQuery';

@QueryHandler(GetSalesReturnByIdQuery)
export class GetSalesReturnByIdQueryHandler implements IQueryHandler<
  GetSalesReturnByIdQuery,
  QueryResult<GetSalesReturnDTO>
> {
  constructor(
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
  ) {}

  async execute(
    query: GetSalesReturnByIdQuery,
  ): Promise<QueryResult<GetSalesReturnDTO>> {
    const result = new QueryResult<GetSalesReturnDTO>();

    const salesReturn = await this.salesReturnRepo
      .createQueryBuilder('salesReturn')
      .leftJoinAndSelect('salesReturn.sale', 'sale')
      .leftJoinAndSelect('salesReturn.branch', 'branch')
      .leftJoinAndSelect('salesReturn.processedBy', 'processedBy')
      .leftJoinAndSelect('salesReturn.details', 'details')
      .leftJoinAndSelect('details.saleDetail', 'saleDetail')
      .leftJoinAndSelect('saleDetail.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('salesReturn.id = :id', { id: query.id })
      .andWhere('salesReturn.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere('sale.isDeleted = false')
      .getOne();

    if (!salesReturn) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Sales return not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: salesReturn.id,
      saleId: salesReturn.saleId,
      receiptNo: salesReturn.sale?.receiptNo ?? '',
      branchId: salesReturn.branchId,
      branchName: salesReturn.branch?.branchName ?? '',
      processedById: salesReturn.processedById,
      processedByName: salesReturn.processedBy?.fullName ?? '',
      reasonCode: salesReturn.reasonCode,
      totalRefund: Number(salesReturn.totalRefund),
      returnDate: salesReturn.returnDate.toISOString(),
      itemCount: salesReturn.details?.length ?? 0,
      items: (salesReturn.details ?? []).map((item) => ({
        id: item.id,
        saleDetailId: item.saleDetailId,
        variantId: item.saleDetail?.variantId ?? 0,
        productName: item.saleDetail?.variant?.product?.productName ?? '',
        sku: item.saleDetail?.variant?.product?.sku ?? '',
        quantity: item.quantity,
        refundAmount: Number(item.refundAmount),
      })),
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
