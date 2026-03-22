import { UpdateAccountDTO } from '../../../Models/DTO/Accounting/AccountingApi';

export class UpdateAccountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly account: UpdateAccountDTO,
  ) {}
}
