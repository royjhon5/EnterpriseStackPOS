import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { CommandResult } from '../../CommandResult';
import { UpdateCustomerCommand } from './UpdateCustomerCommand';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerCommandHandler implements ICommandHandler<
  UpdateCustomerCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async execute(
    command: UpdateCustomerCommand,
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

    const customer = await this.customerRepo.findOne({
      where: {
        id: command.id,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!customer) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Customer not found.';
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    customer.fullName = fullName;
    customer.contactNo = command.customer.contactNo?.trim() || undefined;
    customer.email = command.customer.email?.trim().toLowerCase() || undefined;
    customer.loyaltyPoints = command.customer.loyaltyPoints ?? 0;
    customer.lastModifiedDate = new Date();

    await this.customerRepo.save(customer);

    return new CommandResult<number>({
      response: customer.id,
      statusCode: HttpStatus.OK,
    });
  }
}
