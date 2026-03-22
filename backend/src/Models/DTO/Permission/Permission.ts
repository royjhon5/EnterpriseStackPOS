import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDTO {
  @ApiProperty({ example: 'users.create' })
  permissionCode: string;

  @ApiProperty({ example: 'Allows creating users', required: false })
  description?: string;
}

export class UpdatePermissionDTO {
  @ApiProperty({ example: 'users.create' })
  permissionCode: string;

  @ApiProperty({ example: 'Allows creating users', required: false })
  description?: string;
}

export class GetPermissionDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'users.create' })
  permissionCode: string;

  @ApiProperty({ example: 'Allows creating users', required: false })
  description?: string;
}

export class AssignRolePermissionsDTO {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  permissionIds: number[];
}

export class RolePermissionDTO {
  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 'Admin' })
  roleName: string;

  @ApiProperty({ type: [GetPermissionDTO] })
  permissions: GetPermissionDTO[];
}
