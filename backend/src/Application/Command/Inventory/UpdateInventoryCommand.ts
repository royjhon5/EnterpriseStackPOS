import { UpdateInventoryDTO } from '../../../Models/DTO/Inventory/Inventory';

export class UpdateInventoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly inventory: UpdateInventoryDTO,
  ) {}
}
