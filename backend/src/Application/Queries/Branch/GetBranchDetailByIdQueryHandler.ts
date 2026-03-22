import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBranchDetailByIdQuery } from '../../../Application/Queries/Branch/GetBranchDetailByIdQuery';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../../Application/QueryPageResult';
import { GetBranchDTO } from '../../../Models/DTO/Branch/Branch';
import { HttpStatus } from '@nestjs/common';

@QueryHandler(GetBranchDetailByIdQuery)
export class GetBranchDetailByIdQueryHandler implements IQueryHandler<GetBranchDetailByIdQuery> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async execute(
    query: GetBranchDetailByIdQuery,
  ): Promise<QueryPageResult<GetBranchDTO[]>> {
    const result = new QueryPageResult<GetBranchDTO[]>();

    try {
      const { Id, searchKey, extendedParameters } = query;

      const currentPage = extendedParameters.pageNumber ?? 1;
      const pageSize = extendedParameters.pageSize ?? 10;

      const qb = this.branchRepo
        .createQueryBuilder('b')
        .leftJoinAndSelect('b.tenant', 't')
        .where('b.isDeleted = false')
        .andWhere('b.id = :id', { id: Id })
        .andWhere(
          !searchKey
            ? '1=1'
            : '(b.branchName LIKE :searchKey OR b.address LIKE :searchKey OR t.tenantName LIKE :searchKey)',
          { searchKey: `%${searchKey}%` },
        )
        .orderBy('b.dateCreated', 'DESC');

      const [branches, totalCount] = await qb
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      result.response = branches.map((b) => ({
        Id: b.id,
        branchName: b.branchName,
        address: b.address,
        contactNo: b.contactNo,
        isActive: b.isActive,
        TenantID: b.tenant?.id,
        tenant: b.tenant,
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
      console.error('Error fetching branch by id:', error);
      return result;
    }
  }
}
