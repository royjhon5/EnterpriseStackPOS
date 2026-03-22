import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import { GetInventoryDTO } from '../../../Models/DTO/Inventory/Inventory';
import { QueryResult } from '../../QueryResult';
import { GetInventoryByIdQuery } from './GetInventoryByIdQuery';

@QueryHandler(GetInventoryByIdQuery)
export class GetInventoryByIdQueryHandler implements IQueryHandler<
  GetInventoryByIdQuery,
  QueryResult<GetInventoryDTO>
> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(
    query: GetInventoryByIdQuery,
  ): Promise<QueryResult<GetInventoryDTO>> {
    const result = new QueryResult<GetInventoryDTO>();

    const inventory = await this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.branch', 'branch')
      .leftJoinAndSelect('branch.tenant', 'tenant')
      .leftJoinAndSelect('inventory.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('inventory.id = :id', { id: query.id })
      .andWhere('inventory.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere('product.tenantId = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!inventory) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Inventory record not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: inventory.id,
      branchId: inventory.branchId,
      branchName: inventory.branch?.branchName ?? '',
      variantId: inventory.variantId,
      productId: inventory.variant?.product?.id ?? 0,
      productName: inventory.variant?.product?.productName ?? '',
      sku: inventory.variant?.product?.sku ?? '',
      barcode: inventory.variant?.barcode ?? '',
      unit: inventory.variant?.unit ?? '',
      quantityOnHand: inventory.quantityOnHand,
      reorderLevel: inventory.reorderLevel,
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
