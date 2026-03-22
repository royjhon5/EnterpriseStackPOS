import { UpdateCustomerDTO } from '../../../Models/DTO/Customer/Customer';

export class UpdateCustomerCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly customer: UpdateCustomerDTO,
  ) {}
}
