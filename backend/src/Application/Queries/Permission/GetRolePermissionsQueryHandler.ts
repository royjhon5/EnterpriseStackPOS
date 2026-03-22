import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetRolePermissionsQuery } from '../../../Application/Queries/Permission/GetRolePermissionsQuery';
import { QueryResult } from '../../../Application/QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Role } from '../../../Domain/Entities/Role/Role';
import { RolePermissionDTO } from '../../../Models/DTO/Permission/Permission';

@QueryHandler(GetRolePermissionsQuery)
export class GetRolePermissionsQueryHandler implements IQueryHandler<GetRolePermissionsQuery> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async execute(
    query: GetRolePermissionsQuery,
  ): Promise<QueryResult<RolePermissionDTO>> {
    const result = new QueryResult<RolePermissionDTO>();

    const role = await this.roleRepo.findOne({
      where: { id: query.roleId, isDeleted: false },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Role not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      roleId: role.id,
      roleName: role.roleName,
      permissions: (role.rolePermissions ?? [])
        .filter((rolePermission) => !rolePermission.permission?.isDeleted)
        .map((rolePermission) => ({
          id: rolePermission.permission.id,
          permissionCode: rolePermission.permission.permissionCode,
          description: rolePermission.permission.description,
        })),
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
