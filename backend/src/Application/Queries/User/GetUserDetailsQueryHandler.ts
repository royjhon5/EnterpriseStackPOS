import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPageResult } from 'src/Application/QueryPageResult';
import { User } from 'src/Domain/Entities/User/User';
import { GetUserDTO } from 'src/Models/DTO/User/User';
import { Repository } from 'typeorm';
import { GetUserDetailsQuery } from '../../../Application/Queries/User/GetUserDetailsQuery';

@QueryHandler(GetUserDetailsQuery)
export class GetUserDetailsQueryHandler implements IQueryHandler<GetUserDetailsQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(
    query: GetUserDetailsQuery,
  ): Promise<QueryPageResult<GetUserDTO[]>> {
    const result = new QueryPageResult<GetUserDTO[]>();

    try {
      const { Id, searchKey, extendedParameters } = query;

      const currentPage = extendedParameters.pageNumber;
      const pageSize = extendedParameters.pageSize;

      const qb = this.userRepo
        .createQueryBuilder('t')
        .where('t.isDeleted = false')
        .andWhere('t.id = :id', { Id }) // 👈 THIS IS THE IMPORTANT PART
        .andWhere(
          !searchKey
            ? '1=1'
            : '(t.fullName LIKE :searchKey OR t.email LIKE :searchKey)',
          { searchKey: `%${searchKey}%` },
        )
        .orderBy('t.dateCreated', 'DESC');

      const [users, totalCount] = await qb
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      result.response = users.map((t) => ({
        Id: Number(t.id),
        tenantId: t.tenantId,
        branchId: t.branchId ?? undefined,
        email: t.email ?? '',
        fullName: t.fullName,
        username: t.userName ?? '',
        roleIds: [] as number[],
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
      console.error('Error fetching users:', error);
      result.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return result;
    }
  }
}
