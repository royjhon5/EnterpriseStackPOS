import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UpdateTaxCommand } from './UpdateTaxCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Tax } from '../../../Domain/Entities/Tax/Tax';

@CommandHandler(UpdateTaxCommand)
export class UpdateTaxCommandHandler implements ICommandHandler<
  UpdateTaxCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async execute(command: UpdateTaxCommand): Promise<CommandResult<number>> {
    const taxName = command.tax.taxName?.trim();
    const rate = Number(command.tax.rate);

    const validationError = this.validate(taxName, rate);
    if (validationError) {
      return validationError;
    }

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
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    const duplicate = await this.taxRepo.findOne({
      where: {
        id: Not(command.id),
        tenantId: command.tenantId,
        taxName,
        isDeleted: false,
      },
    });

    if (duplicate) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'Tax already exists for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    tax.taxName = taxName!;
    tax.rate = rate;
    tax.lastModifiedDate = new Date();

    const saved = await this.taxRepo.save(tax);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.OK,
    });
  }

  private validate(
    taxName: string | undefined,
    rate: number,
  ): CommandResult<number> | null {
    if (!taxName) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Tax name is required.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Rate must be a number between 0 and 100.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    return null;
  }
}
