export class PostInventoryCountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
