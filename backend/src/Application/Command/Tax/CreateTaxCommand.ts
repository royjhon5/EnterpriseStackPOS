import { CreateTaxDTO } from '../../../Models/DTO/Tax/TaxApi';

export class CreateTaxCommand {
  constructor(
    public readonly tenantId: number,
    public readonly tax: CreateTaxDTO,
  ) {}
}
