import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Account } from '../../../Domain/Entities/Accounting/Accounting';
import { CommandResult } from '../../CommandResult';
import { DeleteAccountCommand } from './DeleteAccountCommand';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler implements ICommandHandler<
  DeleteAccountCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async execute(
    command: DeleteAccountCommand,
  ): Promise<CommandResult<boolean>> {
    const account = await this.accountRepo.findOne({
      where: { id: command.id, tenantId: command.tenantId, isDeleted: false },
    });

    if (!account) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Account not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    account.isDeleted = true;
    account.lastModifiedDate = new Date();
    await this.accountRepo.save(account);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
