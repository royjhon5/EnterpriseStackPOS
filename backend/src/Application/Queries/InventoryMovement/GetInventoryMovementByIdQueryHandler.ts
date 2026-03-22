import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { InventoryMovement } from '../../../Domain/Entities/Inventory/InventoryMovement';
import { GetInventoryMovementDTO } from '../../../Models/DTO/Inventory/InventoryMovement';
import { QueryResult } from '../../QueryResult';
import { GetInventoryMovementByIdQuery } from './GetInventoryMovementByIdQuery';

@QueryHandler(GetInventoryMovementByIdQuery)
export class GetInventoryMovementByIdQueryHandler implements IQueryHandler<
  GetInventoryMovementByIdQuery,
  QueryResult<GetInventoryMovementDTO>
> {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepo: Repository<InventoryMovement>,
  ) {}

  async execute(
    query: GetInventoryMovementByIdQuery,
  ): Promise<QueryResult<GetInventoryMovementDTO>> {
    const result = new QueryResult<GetInventoryMovementDTO>();

    const movement = await this.movementRepo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.branch', 'branch')
      .leftJoinAndSelect('branch.tenant', 'tenant')
      .leftJoinAndSelect('movement.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('movement.id = :id', { id: query.id })
      .andWhere('movement.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere('product.tenantId = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!movement) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Inventory movement not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: movement.id,
      branchId: movement.branchId,
      branchName: movement.branch?.branchName ?? '',
      variantId: movement.variantId,
      productId: movement.variant?.product?.id ?? 0,
      productName: movement.variant?.product?.productName ?? '',
      sku: movement.variant?.product?.sku ?? '',
      barcode: movement.variant?.barcode ?? '',
      unit: movement.variant?.unit ?? '',
      movementType: movement.movementType,
      quantity: movement.quantity,
      referenceNo: movement.referenceNo,
      createdAt: movement.createdAt.toISOString(),
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
