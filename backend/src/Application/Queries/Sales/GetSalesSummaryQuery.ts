export class GetSalesSummaryQuery {
  constructor(
    public readonly tenantId: number,
    public readonly dateFrom?: string,
    public readonly dateTo?: string,
  ) {}
}
