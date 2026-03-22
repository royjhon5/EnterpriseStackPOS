export class DeleteCategoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
