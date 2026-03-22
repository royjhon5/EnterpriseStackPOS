export class DeleteProductCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
