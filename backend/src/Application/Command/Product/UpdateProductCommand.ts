import { UpdateProductDTO } from '../../../Models/DTO/Product/ProductApi';

export class UpdateProductCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly product: UpdateProductDTO,
  ) {}
}
