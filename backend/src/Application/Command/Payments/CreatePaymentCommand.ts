import { CreatePaymentDTO } from '../../../Models/DTO/Transaction/Payment';

export class CreatePaymentCommand {
  constructor(
    public readonly tenantId: number,
    public readonly saleId: number,
    public readonly payment: CreatePaymentDTO,
  ) {}
}
