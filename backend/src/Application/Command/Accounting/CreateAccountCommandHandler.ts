import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  Account,
  AccountType,
} from '../../../Domain/Entities/Accounting/Accounting';
import { CommandResult } from '../../CommandResult';
import { CreateAccountCommand } from './CreateAccountCommand';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<
  CreateAccountCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(command: CreateAccountCommand): Promise<CommandResult<number>> {
    const accountCode = command.account.accountCode?.trim();
    const accountName = command.account.accountName?.trim();

    if (!accountCode || !accountName) {
      return this.error('Account code and account name are required.');
    }

    if (!Object.values(AccountType).includes(command.account.accountType)) {
      return this.error('Account type is invalid.');
    }

    const existing = await this.accountRepo.findOne({
      where: {
        tenantId: command.tenantId,
        accountCode,
        isDeleted: false,
      },
    });

    if (existing) {
      return this.error(
        'Account code already exists for this tenant.',
        HttpStatus.CONFLICT,
      );
    }

    const account = this.accountRepo.create({
      tenantId: command.tenantId,
      accountCode,
      accountName,
      accountType: command.account.accountType,
    });
    await this.accountRepo.save(account);

    return new CommandResult<number>({
      response: account.id,
      statusCode: HttpStatus.CREATED,
    });
  }

  private error(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ): CommandResult<number> {
    const error = new ValidationError(statusCode);
    error.message = message;
    return new CommandResult<number>({ statusCode, validatorError: error });
  }
}
