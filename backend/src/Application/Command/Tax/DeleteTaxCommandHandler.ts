import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteTaxCommand } from './DeleteTaxCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Tax } from '../../../Domain/Entities/Tax/Tax';

@CommandHandler(DeleteTaxCommand)
export class DeleteTaxCommandHandler implements ICommandHandler<
  DeleteTaxCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async execute(command: DeleteTaxCommand): Promise<CommandResult<boolean>> {
    const tax = await this.taxRepo.findOne({
      where: {
        id: command.id,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!tax) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Tax not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    tax.isDeleted = true;
    tax.lastModifiedDate = new Date();
    await this.taxRepo.save(tax);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
