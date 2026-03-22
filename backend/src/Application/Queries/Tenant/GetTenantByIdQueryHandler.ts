import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTenantByIdQuery } from '../../../Application/Queries/Tenant/GetTenantByIdQuery';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Repository } from 'typeorm';
import { QueryPageResult } from 'src/Application/QueryPageResult';
import { GetTenantDTO } from 'src/Models/DTO/Tenant/Tenant';
import { HttpStatus } from '@nestjs/common';

@QueryHandler(GetTenantByIdQuery)
export class GetTenantByIdQueryHandler implements IQueryHandler<GetTenantByIdQuery> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async execute(
    query: GetTenantByIdQuery,
  ): Promise<QueryPageResult<GetTenantDTO[]>> {
    const result = new QueryPageResult<GetTenantDTO[]>();

    try {
      const { Id, searchKey, extendedParameters } = query;

      const currentPage = extendedParameters.pageNumber ?? 1;
      const pageSize = extendedParameters.pageSize ?? 10;

      const qb = this.tenantRepo
        .createQueryBuilder('t')
        .where('t.isDeleted = false')
        .andWhere('t.id = :id', { id: Id })
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
      console.error('Error fetching tenant by id:', error);
      return result;
    }
  }
}
