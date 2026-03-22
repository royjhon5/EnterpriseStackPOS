import { CreateTenantDTO } from '../../../Models/DTO/Tenant/Tenant';

export class CreateTenantCommand {
  constructor(
    public readonly createdByUserId: string,
    public readonly tenant: CreateTenantDTO,
  ) {}
}
