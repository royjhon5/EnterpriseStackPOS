export class VoidSaleCommand {
  constructor(
    public readonly tenantId: number,
    public readonly saleId: number,
    public readonly voidedById: string,
  ) {}
}
