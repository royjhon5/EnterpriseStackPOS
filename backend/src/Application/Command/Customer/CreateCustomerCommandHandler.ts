import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { CommandResult } from '../../CommandResult';
import { CreateCustomerCommand } from './CreateCustomerCommand';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler implements ICommandHandler<
  CreateCustomerCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async execute(
    command: CreateCustomerCommand,
  ): Promise<CommandResult<number>> {
    const fullName = command.customer.fullName?.trim();

    if (!fullName) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Customer full name is required.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const customer = this.customerRepo.create({
      tenantId: command.tenantId,
      fullName,
      contactNo: command.customer.contactNo?.trim() || undefined,
      email: command.customer.email?.trim().toLowerCase() || undefined,
      loyaltyPoints: command.customer.loyaltyPoints ?? 0,
    });

    await this.customerRepo.save(customer);

    return new CommandResult<number>({
      response: customer.id,
      statusCode: HttpStatus.CREATED,
    });
  }
}
