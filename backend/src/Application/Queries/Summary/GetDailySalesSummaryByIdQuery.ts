export class GetDailySalesSummaryByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
