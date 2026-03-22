import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { InventoryCount } from '../../../Domain/Entities/Inventory/InventoryCount';
import { GetInventoryCountDTO } from '../../../Models/DTO/Inventory/InventoryCountApi';
import { QueryResult } from '../../QueryResult';
import { GetInventoryCountByIdQuery } from './GetInventoryCountByIdQuery';

@QueryHandler(GetInventoryCountByIdQuery)
export class GetInventoryCountByIdQueryHandler implements IQueryHandler<
  GetInventoryCountByIdQuery,
  QueryResult<GetInventoryCountDTO>
> {
  constructor(
    @InjectRepository(InventoryCount)
    private readonly inventoryCountRepo: Repository<InventoryCount>,
  ) {}

  async execute(
    query: GetInventoryCountByIdQuery,
  ): Promise<QueryResult<GetInventoryCountDTO>> {
    const result = new QueryResult<GetInventoryCountDTO>();

    const count = await this.inventoryCountRepo
      .createQueryBuilder('count')
      .leftJoinAndSelect('count.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .leftJoinAndSelect('count.details', 'detail')
      .leftJoinAndSelect('detail.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('count.id = :id', { id: query.id })
      .andWhere('count.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!count) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Inventory count not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: count.id,
      branchId: count.branchId,
      branchName: count.branch?.branchName ?? '',
      countDate: count.countDate,
      status: count.status,
      details:
        count.details?.map((detail) => ({
          id: detail.id,
          inventoryCountId: detail.inventoryCountId,
          variantId: detail.variantId,
          productId: detail.variant?.product?.id ?? 0,
          productName: detail.variant?.product?.productName ?? '',
          barcode: detail.variant?.barcode ?? '',
          unit: detail.variant?.unit ?? '',
          systemQty: detail.systemQty,
          countedQty: detail.countedQty,
          variance: detail.variance,
        })) ?? [],
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
