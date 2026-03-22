import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { CommandResult } from '../../CommandResult';
import { DeleteCustomerCommand } from './DeleteCustomerCommand';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerCommandHandler implements ICommandHandler<
  DeleteCustomerCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async execute(
    command: DeleteCustomerCommand,
  ): Promise<CommandResult<boolean>> {
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
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    customer.isDeleted = true;
    customer.lastModifiedDate = new Date();
    await this.customerRepo.save(customer);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
