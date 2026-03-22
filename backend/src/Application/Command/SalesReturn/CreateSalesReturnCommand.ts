import { CreateSalesReturnDTO } from '../../../Models/DTO/SalesReturn/SalesReturn';

export class CreateSalesReturnCommand {
  constructor(
    public readonly tenantId: number,
    public readonly processedById: string,
    public readonly salesReturn: CreateSalesReturnDTO,
  ) {}
}
