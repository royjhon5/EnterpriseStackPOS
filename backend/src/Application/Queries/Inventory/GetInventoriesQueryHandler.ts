import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import { GetInventoryDTO } from '../../../Models/DTO/Inventory/Inventory';
import { QueryPageResult } from '../../QueryPageResult';
import { GetInventoriesQuery } from './GetInventoriesQuery';

@QueryHandler(GetInventoriesQuery)
export class GetInventoriesQueryHandler implements IQueryHandler<
  GetInventoriesQuery,
  QueryPageResult<GetInventoryDTO[]>
> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(
    query: GetInventoriesQuery,
  ): Promise<QueryPageResult<GetInventoryDTO[]>> {
    const result = new QueryPageResult<GetInventoryDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.branch', 'branch')
      .leftJoinAndSelect('branch.tenant', 'tenant')
      .leftJoinAndSelect('inventory.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('inventory.isDeleted = false')
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
            )`,
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('product.productName', 'ASC');

    const [inventories, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = inventories.map((inventory) => ({
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
