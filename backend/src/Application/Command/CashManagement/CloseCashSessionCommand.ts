import { CloseCashSessionDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';

export class CloseCashSessionCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly session: CloseCashSessionDTO,
  ) {}
}
