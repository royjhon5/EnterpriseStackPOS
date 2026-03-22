export class GetCashMovementByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly sessionId: number,
    public readonly id: number,
  ) {}
}
