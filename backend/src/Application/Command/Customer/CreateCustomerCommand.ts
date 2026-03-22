import { CreateCustomerDTO } from '../../../Models/DTO/Customer/Customer';

export class CreateCustomerCommand {
  constructor(
    public readonly tenantId: number,
    public readonly customer: CreateCustomerDTO,
  ) {}
}
