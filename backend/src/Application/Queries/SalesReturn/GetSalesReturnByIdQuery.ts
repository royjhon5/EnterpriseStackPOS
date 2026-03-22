export class GetSalesReturnByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
