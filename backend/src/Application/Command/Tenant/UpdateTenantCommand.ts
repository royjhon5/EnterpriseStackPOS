import { UpdateTenantDTO } from '../../../Models/DTO/Tenant/Tenant';

export class UpdateTenantCommand {
  constructor(
    public readonly tenantId: number,
    public readonly tenant: UpdateTenantDTO,
    // public readonly updatedByUserId: string,
  ) {}
}
