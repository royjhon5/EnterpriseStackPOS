import { CreateProductDTO } from '../../../Models/DTO/Product/ProductApi';

export class CreateProductCommand {
  constructor(
    public readonly tenantId: number,
    public readonly product: CreateProductDTO,
  ) {}
}
