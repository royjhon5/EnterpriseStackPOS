import { CreateSaleDTO } from '../../../Models/DTO/Sales/SaleHeader';

export class CreateSaleCommand {
  constructor(
    public readonly tenantId: number,
    public readonly cashierId: string,
    public readonly sale: CreateSaleDTO,
  ) {}
}
