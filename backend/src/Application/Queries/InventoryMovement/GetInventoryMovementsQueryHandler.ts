import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from '../../../Domain/Entities/Inventory/InventoryMovement';
import { GetInventoryMovementDTO } from '../../../Models/DTO/Inventory/InventoryMovement';
import { QueryPageResult } from '../../QueryPageResult';
import { GetInventoryMovementsQuery } from './GetInventoryMovementsQuery';

@QueryHandler(GetInventoryMovementsQuery)
export class GetInventoryMovementsQueryHandler implements IQueryHandler<
  GetInventoryMovementsQuery,
  QueryPageResult<GetInventoryMovementDTO[]>
> {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepo: Repository<InventoryMovement>,
  ) {}

  async execute(
    query: GetInventoryMovementsQuery,
  ): Promise<QueryPageResult<GetInventoryMovementDTO[]>> {
    const result = new QueryPageResult<GetInventoryMovementDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.movementRepo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.branch', 'branch')
      .leftJoinAndSelect('branch.tenant', 'tenant')
      .leftJoinAndSelect('movement.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('movement.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere('product.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : `(
              branch.branchName LIKE :searchKey
              OR product.productName LIKE :searchKey
              OR product.sku LIKE :searchKey
              OR variant.barcode LIKE :searchKey
              OR movement.referenceNo LIKE :searchKey
            )`,
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('movement.createdAt', 'DESC');

    const [movements, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = movements.map((movement) => ({
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
