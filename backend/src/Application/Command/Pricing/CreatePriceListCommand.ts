import { CreatePriceListDTO } from '../../../Models/DTO/Pricing/PricingApi';

export class CreatePriceListCommand {
  constructor(
    public readonly tenantId: number,
    public readonly priceList: CreatePriceListDTO,
  ) {}
}
