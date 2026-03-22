import { CloseShiftDTO } from '../../../Models/DTO/POS/POSApi';

export class CloseShiftCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly shift: CloseShiftDTO,
  ) {}
}
