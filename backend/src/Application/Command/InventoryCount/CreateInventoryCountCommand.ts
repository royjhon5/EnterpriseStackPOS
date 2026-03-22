import { CreateInventoryCountDTO } from '../../../Models/DTO/Inventory/InventoryCountApi';

export class CreateInventoryCountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly count: CreateInventoryCountDTO,
  ) {}
}
