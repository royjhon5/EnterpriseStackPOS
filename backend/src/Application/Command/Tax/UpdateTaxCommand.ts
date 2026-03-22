import { UpdateTaxDTO } from '../../../Models/DTO/Tax/TaxApi';

export class UpdateTaxCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly tax: UpdateTaxDTO,
  ) {}
}
