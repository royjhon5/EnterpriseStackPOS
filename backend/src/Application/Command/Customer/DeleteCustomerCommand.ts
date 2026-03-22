export class DeleteCustomerCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
