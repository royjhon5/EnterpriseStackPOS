import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesReturn } from '../../../Domain/Entities/SalesReturn/SalesReturn';
import { GetSalesReturnDTO } from '../../../Models/DTO/SalesReturn/SalesReturn';
import { QueryPageResult } from '../../QueryPageResult';
import { GetSalesReturnsQuery } from './GetSalesReturnsQuery';

@QueryHandler(GetSalesReturnsQuery)
export class GetSalesReturnsQueryHandler implements IQueryHandler<
  GetSalesReturnsQuery,
  QueryPageResult<GetSalesReturnDTO[]>
> {
  constructor(
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
  ) {}

  async execute(
    query: GetSalesReturnsQuery,
  ): Promise<QueryPageResult<GetSalesReturnDTO[]>> {
    const result = new QueryPageResult<GetSalesReturnDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.salesReturnRepo
      .createQueryBuilder('salesReturn')
      .leftJoinAndSelect('salesReturn.sale', 'sale')
      .leftJoinAndSelect('salesReturn.branch', 'branch')
      .leftJoinAndSelect('salesReturn.processedBy', 'processedBy')
      .leftJoinAndSelect('salesReturn.details', 'details')
      .where('salesReturn.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere('sale.isDeleted = false')
      .andWhere(
        !query.searchKey
          ? '1=1'
          : `(
              sale.receiptNo LIKE :searchKey
              OR salesReturn.reasonCode LIKE :searchKey
              OR branch.branchName LIKE :searchKey
              OR processedBy.fullName LIKE :searchKey
            )`,
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('salesReturn.returnDate', 'DESC');

    const [salesReturns, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = salesReturns.map((salesReturn) => ({
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
