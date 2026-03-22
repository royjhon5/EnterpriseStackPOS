import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaxCommand } from './CreateTaxCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Tax } from '../../../Domain/Entities/Tax/Tax';

@CommandHandler(CreateTaxCommand)
export class CreateTaxCommandHandler implements ICommandHandler<
  CreateTaxCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async execute(command: CreateTaxCommand): Promise<CommandResult<number>> {
    const taxName = command.tax.taxName?.trim();
    const rate = Number(command.tax.rate);

    const validationError = this.validate(taxName, rate);
    if (validationError) {
      return validationError;
    }

    const existing = await this.taxRepo.findOne({
      where: {
        tenantId: command.tenantId,
        taxName,
        isDeleted: false,
      },
    });

    if (existing) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'Tax already exists for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    const tax = this.taxRepo.create({
      tenantId: command.tenantId,
      taxName,
      rate,
    });

    const saved = await this.taxRepo.save(tax);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.CREATED,
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
