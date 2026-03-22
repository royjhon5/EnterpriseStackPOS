// application/queries/get-all-tenants.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { GetAllTenantsQuery } from '../../../Application/Queries/Tenant/GetAllTenantsQuery';
import { QueryPageResult } from '../../../Application/QueryPageResult';
import { GetTenantDTO } from '../../../Models/DTO/Tenant/Tenant';

@QueryHandler(GetAllTenantsQuery)
export class GetAllTenantsQueryHandler implements IQueryHandler<GetAllTenantsQuery> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async execute(
    query: GetAllTenantsQuery,
  ): Promise<QueryPageResult<GetTenantDTO[]>> {
    const result = new QueryPageResult<GetTenantDTO[]>();
    try {
      const { searchKey, extendedParameters } = query;

      const currentPage = extendedParameters.pageNumber;
      const pageSize = extendedParameters.pageSize;

      const qb = this.tenantRepo
        .createQueryBuilder('t')
        .where('t.isDeleted = false')
        .andWhere(
          !searchKey
            ? '1=1'
            : '(t.tenantName LIKE :searchKey OR t.code LIKE :searchKey)',
          { searchKey: `%${searchKey}%` },
        )
        .orderBy('t.dateCreated', 'DESC');

      const [tenants, totalCount] = await qb
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      result.response = tenants.map((t) => ({
        id: t.id,
        name: t.tenantName,
        tenantName: t.tenantName,
        code: t.code,
        subscriptionPlan: t.subscriptionPlan,
        isActive: t.isActive,
      }));

      const totalPages = Math.ceil(totalCount / pageSize);

      result.pageDetails = {
        totalCount,
        pageSize,
        currentPage,
        totalPages,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < totalPages,
      };

      result.statusCode = HttpStatus.OK;
      return result;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      result.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return result;
    }
  }
}
