import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetPermissionByIdQuery } from '../../../Application/Queries/Permission/GetPermissionByIdQuery';
import { QueryResult } from '../../../Application/QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Permission } from '../../../Domain/Entities/Permission/Permission';
import { GetPermissionDTO } from '../../../Models/DTO/Permission/Permission';

@QueryHandler(GetPermissionByIdQuery)
export class GetPermissionByIdQueryHandler implements IQueryHandler<GetPermissionByIdQuery> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async execute(
    query: GetPermissionByIdQuery,
  ): Promise<QueryResult<GetPermissionDTO>> {
    const result = new QueryResult<GetPermissionDTO>();

    const permission = await this.permissionRepo.findOne({
      where: { id: query.id, isDeleted: false },
    });

    if (!permission) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Permission not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: permission.id,
      permissionCode: permission.permissionCode,
      description: permission.description,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
