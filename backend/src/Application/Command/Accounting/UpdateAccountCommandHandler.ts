import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  Account,
  AccountType,
} from '../../../Domain/Entities/Accounting/Accounting';
import { CommandResult } from '../../CommandResult';
import { UpdateAccountCommand } from './UpdateAccountCommand';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler implements ICommandHandler<
  UpdateAccountCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<CommandResult<number>> {
    const accountCode = command.account.accountCode?.trim();
    const accountName = command.account.accountName?.trim();

    if (!accountCode || !accountName) {
      return this.error('Account code and account name are required.');
    }

    if (!Object.values(AccountType).includes(command.account.accountType)) {
      return this.error('Account type is invalid.');
    }

    const account = await this.accountRepo.findOne({
      where: { id: command.id, tenantId: command.tenantId, isDeleted: false },
    });

    if (!account) {
      return this.error('Account not found.', HttpStatus.NOT_FOUND);
    }

    const duplicate = await this.accountRepo.findOne({
      where: {
        id: Not(command.id),
        tenantId: command.tenantId,
        accountCode,
        isDeleted: false,
      },
    });

    if (duplicate) {
      return this.error(
        'Account code already exists for this tenant.',
        HttpStatus.CONFLICT,
      );
    }

    account.accountCode = accountCode;
    account.accountName = accountName;
    account.accountType = command.account.accountType;
    account.lastModifiedDate = new Date();
    await this.accountRepo.save(account);

    return new CommandResult<number>({
      response: account.id,
      statusCode: HttpStatus.OK,
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
