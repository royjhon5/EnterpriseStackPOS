export class GetPaymentByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly saleId: number,
    public readonly paymentId: number,
  ) {}
}
