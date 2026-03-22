import { CreatePOSDeviceDTO } from '../../../Models/DTO/POS/POSApi';

export class CreatePOSDeviceCommand {
  constructor(
    public readonly tenantId: number,
    public readonly device: CreatePOSDeviceDTO,
  ) {}
}
