import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import { CommandResult } from '../../CommandResult';
import { DeleteInventoryCommand } from './DeleteInventoryCommand';

@CommandHandler(DeleteInventoryCommand)
export class DeleteInventoryCommandHandler implements ICommandHandler<
  DeleteInventoryCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(
    command: DeleteInventoryCommand,
  ): Promise<CommandResult<boolean>> {
    const inventory = await this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoin('inventory.variant', 'variant')
      .leftJoin('variant.product', 'product')
      .leftJoin('inventory.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('inventory.id = :id', { id: command.id })
      .andWhere('inventory.isDeleted = false')
      .andWhere('product.tenantId = :tenantId', { tenantId: command.tenantId })
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!inventory) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Inventory record not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    inventory.isDeleted = true;
    inventory.lastModifiedDate = new Date();
    await this.inventoryRepo.save(inventory);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
