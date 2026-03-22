import { CreateInventoryDTO } from '../../../Models/DTO/Inventory/Inventory';

export class CreateInventoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly inventory: CreateInventoryDTO,
  ) {}
}
