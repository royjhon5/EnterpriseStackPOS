import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import {
  Payment,
  PaymentMethod,
} from '../../../Domain/Entities/Transaction/Payment';
import { CommandResult } from '../../CommandResult';
import { CreatePaymentCommand } from './CreatePaymentCommand';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler implements ICommandHandler<
  CreatePaymentCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CommandResult<number>> {
    const amount = Number(command.payment.amount);

    if (!Object.values(PaymentMethod).includes(command.payment.paymentMethod)) {
      return this.validationResult('Payment method is invalid.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return this.validationResult('Payment amount must be greater than zero.');
    }

    const sale = await this.saleRepo.findOne({
      where: {
        id: command.saleId,
        tenantId: command.tenantId,
        isDeleted: false,
      },
      relations: { payments: true },
    });

    if (!sale) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Sale not found.';
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    if ([SaleStatus.VOIDED, SaleStatus.REFUNDED].includes(sale.status)) {
      return this.validationResult(
        'Payments cannot be captured for voided or refunded sales.',
      );
    }

    const totalPaid = (sale.payments ?? []).reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const nextTotalPaid = Number((totalPaid + amount).toFixed(2));

    if (nextTotalPaid - Number(sale.netAmount) > 0.0001) {
      return this.validationResult('Payment would exceed the sale net amount.');
    }

    const nextStatus =
      nextTotalPaid === 0
        ? SaleStatus.PENDING_PAYMENT
        : nextTotalPaid < Number(sale.netAmount)
          ? SaleStatus.PARTIALLY_PAID
          : SaleStatus.PAID;

    const paymentId = await this.dataSource.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(Payment);
      const saleRepo = manager.getRepository(SaleHeader);

      const payment = paymentRepo.create({
        saleId: sale.id,
        paymentMethod: command.payment.paymentMethod,
        amount,
        referenceNo: command.payment.referenceNo?.trim() || undefined,
      });

      await paymentRepo.save(payment);
      sale.status = nextStatus;
      sale.lastModifiedDate = new Date();
      await saleRepo.save(sale);

      return payment.id;
    });

    return new CommandResult<number>({
      response: paymentId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private validationResult(message: string): CommandResult<number> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<number>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
