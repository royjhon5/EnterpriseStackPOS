import { ApiProperty } from '@nestjs/swagger';

export class LoginCredentialsDTO {
  @ApiProperty({ example: '' })
  UserName: string;

  @ApiProperty({ example: '' })
  Password: string;
}

export class LoginUserDTO {
  @ApiProperty({ example: 0 })
  TenantId: number;

  @ApiProperty({ example: '' })
  UserId: string;

  @ApiProperty({ example: '' })
  Token: string;

  @ApiProperty({ example: '' })
  FullName: string;

  @ApiProperty({ example: '' })
  Email?: string;

  @ApiProperty({ example: '' })
  RoleType?: string;

  @ApiProperty({ example: '' })
  phoneNumber?: string;
}

export class CreateUserDTO {
  @ApiProperty({ example: 0 })
  tenantId: number;

  @ApiProperty({ example: 0 })
  branchId?: number;

  @ApiProperty({ example: '' })
  email: string;

  @ApiProperty({ example: '' })
  fullName: string;

  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty({ example: '' })
  password?: string;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty({ example: 0 })
  roleIds: number;
}

export class UpdateUserDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty({ example: 0 })
  tenantId: number;

  @ApiProperty({ example: 0 })
  branchId?: number;

  @ApiProperty({ example: '' })
  email: string;

  @ApiProperty({ example: '' })
  fullName: string;

  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty({ example: '' })
  password?: string;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty({ example: 0 })
  roleIds: number;
}

export class ActivateUserDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty()
  isActive?: boolean;
}

export class DeActivateUserDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty()
  isActive?: boolean;
}

export class GetUserDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty({ example: 0 })
  tenantId: number;

  @ApiProperty({ example: 0 })
  branchId?: number;

  @ApiProperty({ example: '' })
  email: string;

  @ApiProperty({ example: '' })
  fullName: string;

  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty({ example: 0 })
  roleIds: number[];
}
