export class CancelInventoryCountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
