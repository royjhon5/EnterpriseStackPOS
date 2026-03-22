import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  InventoryCount,
  InventoryCountStatus,
} from '../../../Domain/Entities/Inventory/InventoryCount';
import { CommandResult } from '../../CommandResult';
import { CancelInventoryCountCommand } from './CancelInventoryCountCommand';

@CommandHandler(CancelInventoryCountCommand)
export class CancelInventoryCountCommandHandler implements ICommandHandler<
  CancelInventoryCountCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(InventoryCount)
    private readonly inventoryCountRepo: Repository<InventoryCount>,
  ) {}

  async execute(
    command: CancelInventoryCountCommand,
  ): Promise<CommandResult<number>> {
    const count = await this.inventoryCountRepo.findOne({
      where: { id: command.id, isDeleted: false },
      relations: ['branch', 'branch.tenant'],
    });

    if (!count || count.branch?.tenant?.id !== command.tenantId) {
      return this.validationError(
        'Inventory count not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (count.status !== InventoryCountStatus.DRAFT) {
      return this.validationError(
        'Only draft inventory counts can be cancelled.',
        HttpStatus.CONFLICT,
      );
    }

    count.status = InventoryCountStatus.CANCELLED;
    count.lastModifiedDate = new Date();
    await this.inventoryCountRepo.save(count);

    return new CommandResult<number>({
      response: count.id,
      statusCode: HttpStatus.OK,
    });
  }

  private validationError(
    message: string,
    statusCode: HttpStatus,
  ): CommandResult<number> {
    const error = new ValidationError(statusCode);
    error.message = message;
    return new CommandResult<number>({
      statusCode,
      validatorError: error,
    });
  }
}
