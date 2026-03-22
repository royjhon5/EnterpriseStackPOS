import { ApiProperty } from '@nestjs/swagger';
import { GetTenantDTO } from '../../../Models/DTO/Tenant/Tenant';

export class CreateBranchDTO {
  @ApiProperty({ example: 0 })
  TenantID: number;

  @ApiProperty({ example: '' })
  branchName: string;

  @ApiProperty({ example: '', required: false })
  address?: string;

  @ApiProperty({ example: '', required: false })
  contactNo: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UpdateBranchDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty({ example: 0 })
  TenantID: number;

  @ApiProperty({ example: '' })
  branchName: string;

  @ApiProperty({ example: '', required: false })
  address?: string;

  @ApiProperty({ example: '', required: false })
  contactNo: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class GetBranchDTO {
  @ApiProperty({ example: 0 })
  Id: number;

  @ApiProperty({ example: 0 })
  TenantID: number;

  @ApiProperty({ example: '' })
  branchName: string;

  @ApiProperty({ example: '', required: false })
  address?: string;

  @ApiProperty({ example: '', required: false })
  contactNo: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: () => GetTenantDTO })
  tenant: GetTenantDTO;
}
