import { CreateCashMovementDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';

export class CreateCashMovementCommand {
  constructor(
    public readonly tenantId: number,
    public readonly sessionId: number,
    public readonly movement: CreateCashMovementDTO,
  ) {}
}
