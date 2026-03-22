import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { QueryPageResult } from '../../../Application/QueryPageResult';
import { GetBranchDTO } from '../../../Models/DTO/Branch/Branch';
import { GetAllBranchQuery } from '../../../Application/Queries/Branch/GetAllBranchQuery';

@QueryHandler(GetAllBranchQuery)
export class GetAllBranchesQueryHandler implements IQueryHandler<GetAllBranchQuery> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async execute(
    query: GetAllBranchQuery,
  ): Promise<QueryPageResult<GetBranchDTO[]>> {
    const result = new QueryPageResult<GetBranchDTO[]>();

    try {
      const { extendedParameters } = query;

      const currentPage = extendedParameters?.pageNumber ?? 1;
      const pageSize = extendedParameters?.pageSize ?? 10;

      const qb = this.branchRepo
        .createQueryBuilder('b')
        .leftJoinAndSelect('b.tenant', 't')
        .where('b.isDeleted = false');

      const [branches, totalCount] = await qb
        .orderBy('b.dateCreated', 'DESC')
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
      console.error('Error fetching branches:', error);
      return result;
    }
  }
}
