export class GetShiftByIdQuery {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
