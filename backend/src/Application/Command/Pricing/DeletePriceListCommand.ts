export class DeletePriceListCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
