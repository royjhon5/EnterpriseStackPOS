export class DeleteInventoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
