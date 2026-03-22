import { OpenShiftDTO } from '../../../Models/DTO/POS/POSApi';

export class OpenShiftCommand {
  constructor(
    public readonly tenantId: number,
    public readonly shift: OpenShiftDTO,
  ) {}
}
