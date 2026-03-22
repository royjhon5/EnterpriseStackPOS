import { UpdatePOSDeviceDTO } from '../../../Models/DTO/POS/POSApi';

export class UpdatePOSDeviceCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly device: UpdatePOSDeviceDTO,
  ) {}
}
