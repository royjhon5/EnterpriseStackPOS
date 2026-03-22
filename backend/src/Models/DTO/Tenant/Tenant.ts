import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDTO {
  @ApiProperty({ example: 'Tenant A' })
  tenantName: string;
  @ApiProperty({ example: 'Tenant A' })
  name: string;

  @ApiProperty({ example: 'TEN-001' })
  code: string;

  @ApiProperty({ example: 'PREMIUM', required: false })
  subscriptionPlan?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UpdateTenantDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tenant A' })
  tenantName: string;

  @ApiProperty({ example: 'Tenant A' })
  name: string;

  @ApiProperty({ example: 'TEN-001' })
  code: string;

  @ApiProperty({ example: 'PREMIUM', required: false })
  subscriptionPlan?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class GetTenantDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tenant A' })
  tenantName: string;

  @ApiProperty({ example: 'Tenant A' })
  name: string;

  @ApiProperty({ example: 'TEN-001' })
  code: string;

  @ApiProperty({ example: 'PREMIUM', required: false })
  subscriptionPlan?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
