export class GetSaleByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
