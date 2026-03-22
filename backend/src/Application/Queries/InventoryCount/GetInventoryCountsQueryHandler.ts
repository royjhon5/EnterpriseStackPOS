import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { InventoryCount } from '../../../Domain/Entities/Inventory/InventoryCount';
import { GetInventoryCountDTO } from '../../../Models/DTO/Inventory/InventoryCountApi';
import { GetInventoryCountsQuery } from './GetInventoryCountsQuery';

@QueryHandler(GetInventoryCountsQuery)
export class GetInventoryCountsQueryHandler implements IQueryHandler<
  GetInventoryCountsQuery,
  QueryPageResult<GetInventoryCountDTO[]>
> {
  constructor(
    @InjectRepository(InventoryCount)
    private readonly inventoryCountRepo: Repository<InventoryCount>,
  ) {}

  async execute(
    query: GetInventoryCountsQuery,
  ): Promise<QueryPageResult<GetInventoryCountDTO[]>> {
    const result = new QueryPageResult<GetInventoryCountDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.inventoryCountRepo
      .createQueryBuilder('count')
      .leftJoinAndSelect('count.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('count.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(branch.branchName LIKE :searchKey OR count.status LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('count.countDate', 'DESC')
      .addOrderBy('count.id', 'DESC');

    const [counts, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = counts.map((count) => ({
      id: count.id,
      branchId: count.branchId,
      branchName: count.branch?.branchName ?? '',
      countDate: count.countDate,
      status: count.status,
      details: [],
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
