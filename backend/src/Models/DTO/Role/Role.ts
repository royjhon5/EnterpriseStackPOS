import { ApiProperty } from '@nestjs/swagger';

export class RoleDTO {
  @ApiProperty({ example: '' })
  roleName: string;
}

export class UpdateRoleDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty({ example: '' })
  roleName: string;
}
