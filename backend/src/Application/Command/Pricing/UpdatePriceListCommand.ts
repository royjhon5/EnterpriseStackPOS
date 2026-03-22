import { UpdatePriceListDTO } from '../../../Models/DTO/Pricing/PricingApi';

export class UpdatePriceListCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly priceList: UpdatePriceListDTO,
  ) {}
}
