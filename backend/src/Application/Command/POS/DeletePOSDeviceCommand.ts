export class DeletePOSDeviceCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
  ) {}
}
