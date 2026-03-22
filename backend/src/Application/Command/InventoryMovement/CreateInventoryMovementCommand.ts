import { CreateInventoryMovementDTO } from '../../../Models/DTO/Inventory/InventoryMovement';

export class CreateInventoryMovementCommand {
  constructor(
    public readonly tenantId: number,
    public readonly movement: CreateInventoryMovementDTO,
  ) {}
}
