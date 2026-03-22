import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { GetSaleDTO } from '../../../Models/DTO/Sales/SaleHeader';
import { QueryPageResult } from '../../QueryPageResult';
import { GetSalesQuery } from './GetSalesQuery';

@QueryHandler(GetSalesQuery)
export class GetSalesQueryHandler implements IQueryHandler<
  GetSalesQuery,
  QueryPageResult<GetSaleDTO[]>
> {
  constructor(
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
  ) {}

  async execute(query: GetSalesQuery): Promise<QueryPageResult<GetSaleDTO[]>> {
    const result = new QueryPageResult<GetSaleDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.branch', 'branch')
      .leftJoinAndSelect('sale.cashier', 'cashier')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.saleDetails', 'details')
      .leftJoinAndSelect('sale.payments', 'payments')
      .where('sale.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : `(
              sale.receiptNo LIKE :searchKey
              OR branch.branchName LIKE :searchKey
              OR cashier.fullName LIKE :searchKey
              OR customer.fullName LIKE :searchKey
            )`,
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('sale.saleDate', 'DESC');

    const [sales, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = sales.map((sale) => {
      const totalPaid = Number(
        (sale.payments ?? [])
          .reduce((sum, payment) => sum + Number(payment.amount), 0)
          .toFixed(2),
      );
      const balanceDue = [SaleStatus.VOIDED, SaleStatus.REFUNDED].includes(
        sale.status,
      )
        ? 0
        : Number(Math.max(Number(sale.netAmount) - totalPaid, 0).toFixed(2));

      return {
        id: sale.id,
        tenantId: sale.tenantId,
        branchId: sale.branchId,
        branchName: sale.branch?.branchName ?? '',
        cashierId: sale.cashierId,
        cashierName: sale.cashier?.fullName ?? '',
        customerId: sale.customerId,
        customerName: sale.customer?.fullName,
        receiptNo: sale.receiptNo,
        grossAmount: Number(sale.grossAmount),
        discountAmount: Number(sale.discountAmount),
        taxAmount: Number(sale.taxAmount),
        netAmount: Number(sale.netAmount),
        totalPaid,
        balanceDue,
        paymentCount: sale.payments?.length ?? 0,
        status: sale.status,
        saleDate: sale.saleDate.toISOString(),
        itemCount: sale.saleDetails?.length ?? 0,
      };
    });
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
