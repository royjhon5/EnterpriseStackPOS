export class GetCustomerByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
