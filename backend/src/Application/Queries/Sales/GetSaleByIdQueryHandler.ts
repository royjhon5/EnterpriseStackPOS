import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { SalesReturn } from '../../../Domain/Entities/SalesReturn/SalesReturn';
import { GetSaleDTO } from '../../../Models/DTO/Sales/SaleHeader';
import { QueryResult } from '../../QueryResult';
import { GetSaleByIdQuery } from './GetSaleByIdQuery';

@QueryHandler(GetSaleByIdQuery)
export class GetSaleByIdQueryHandler implements IQueryHandler<
  GetSaleByIdQuery,
  QueryResult<GetSaleDTO>
> {
  constructor(
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
  ) {}

  async execute(query: GetSaleByIdQuery): Promise<QueryResult<GetSaleDTO>> {
    const result = new QueryResult<GetSaleDTO>();

    const sale = await this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.branch', 'branch')
      .leftJoinAndSelect('sale.cashier', 'cashier')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.saleDetails', 'details')
      .leftJoinAndSelect('sale.payments', 'payments')
      .leftJoinAndSelect('details.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('sale.id = :id', { id: query.id })
      .andWhere('sale.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: query.tenantId })
      .addOrderBy('payments.createdAt', 'ASC')
      .getOne();

    if (!sale) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Sale not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

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

    const salesReturns = await this.salesReturnRepo.find({
      where: { saleId: sale.id, isDeleted: false },
      relations: {
        branch: true,
        processedBy: true,
        details: {
          saleDetail: {
            variant: {
              product: true,
            },
          },
        },
      },
      order: { returnDate: 'DESC' },
    });
    const salesReturnCount = salesReturns.length;
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
    const returnedBySaleDetailId = new Map<
      number,
      { returnedQuantity: number; refundedAmount: number }
    >();
    for (const salesReturn of salesReturns) {
      for (const detail of salesReturn.details ?? []) {
        const current = returnedBySaleDetailId.get(detail.saleDetailId) ?? {
          returnedQuantity: 0,
          refundedAmount: 0,
        };
        returnedBySaleDetailId.set(detail.saleDetailId, {
          returnedQuantity: current.returnedQuantity + detail.quantity,
          refundedAmount: Number(
            (current.refundedAmount + Number(detail.refundAmount)).toFixed(2),
          ),
        });
      }
    }

    const refundableAmount = Number(
      Math.max(
        Math.min(totalPaid, Number(sale.netAmount)) - totalRefundedAmount,
        0,
      ).toFixed(2),
    );

    result.response = {
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
      hasReturns: salesReturnCount > 0,
      salesReturnCount,
      totalReturnedQuantity,
      totalRefundedAmount,
      refundableAmount,
      status: sale.status,
      saleDate: sale.saleDate.toISOString(),
      itemCount: sale.saleDetails?.length ?? 0,
      items: (sale.saleDetails ?? []).map((item) => {
        const returned = returnedBySaleDetailId.get(item.id);
        const returnedQuantity = returned?.returnedQuantity ?? 0;

        return {
          id: item.id,
          variantId: item.variantId,
          productId: item.variant?.product?.id ?? 0,
          productName: item.variant?.product?.productName ?? '',
          sku: item.variant?.product?.sku ?? '',
          barcode: item.variant?.barcode ?? '',
          unit: item.variant?.unit ?? '',
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
          returnedQuantity,
          remainingReturnableQuantity: Math.max(
            item.quantity - returnedQuantity,
            0,
          ),
          refundedAmount: returned?.refundedAmount ?? 0,
        };
      }),
      payments: (sale.payments ?? []).map((payment) => ({
        id: payment.id,
        saleId: sale.id,
        receiptNo: sale.receiptNo,
        paymentMethod: payment.paymentMethod,
        amount: Number(payment.amount),
        referenceNo: payment.referenceNo,
        createdAt: payment.dateCreated.toISOString(),
      })),
      salesReturns: salesReturns.map((salesReturn) => ({
        id: salesReturn.id,
        saleId: salesReturn.saleId,
        receiptNo: sale.receiptNo,
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
      })),
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
