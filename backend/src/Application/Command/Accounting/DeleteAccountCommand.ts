export class DeleteAccountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
