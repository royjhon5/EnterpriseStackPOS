import { OpenCashSessionDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';

export class OpenCashSessionCommand {
  constructor(
    public readonly tenantId: number,
    public readonly session: OpenCashSessionDTO,
  ) {}
}
