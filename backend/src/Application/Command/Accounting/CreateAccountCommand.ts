import { CreateAccountDTO } from '../../../Models/DTO/Accounting/AccountingApi';

export class CreateAccountCommand {
  constructor(
    public readonly tenantId: number,
    public readonly account: CreateAccountDTO,
  ) {}
}
