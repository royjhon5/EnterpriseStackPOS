import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAllPermissionsQuery } from '../../../Application/Queries/Permission/GetAllPermissionsQuery';
import { QueryPageResult } from '../../../Application/QueryPageResult';
import { Permission } from '../../../Domain/Entities/Permission/Permission';
import { GetPermissionDTO } from '../../../Models/DTO/Permission/Permission';

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsQueryHandler implements IQueryHandler<GetAllPermissionsQuery> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async execute(
    query: GetAllPermissionsQuery,
  ): Promise<QueryPageResult<GetPermissionDTO[]>> {
    const result = new QueryPageResult<GetPermissionDTO[]>();

    try {
      const currentPage = query.extendedParameters?.pageNumber ?? 1;
      const pageSize = query.extendedParameters?.pageSize ?? 10;
      const searchKey = query.searchKey?.trim();

      const qb = this.permissionRepo
        .createQueryBuilder('permission')
        .where('permission.isDeleted = false')
        .andWhere(
          !searchKey
            ? '1=1'
            : '(permission.permissionCode LIKE :searchKey OR permission.description LIKE :searchKey)',
          { searchKey: `%${searchKey}%` },
        )
        .orderBy('permission.permissionCode', 'ASC');

      const [permissions, totalCount] = await qb
        .skip((currentPage - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      result.response = permissions.map((permission) => ({
        id: permission.id,
        permissionCode: permission.permissionCode,
        description: permission.description,
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
      console.error('Error fetching permissions:', error);
      result.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return result;
    }
  }
}
