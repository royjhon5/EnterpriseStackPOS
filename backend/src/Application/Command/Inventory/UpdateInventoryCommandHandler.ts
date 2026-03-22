import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import { CommandResult } from '../../CommandResult';
import { UpdateInventoryCommand } from './UpdateInventoryCommand';

@CommandHandler(UpdateInventoryCommand)
export class UpdateInventoryCommandHandler implements ICommandHandler<
  UpdateInventoryCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(
    command: UpdateInventoryCommand,
  ): Promise<CommandResult<number>> {
    const { quantityOnHand, reorderLevel } = command.inventory;

    if (quantityOnHand < 0 || reorderLevel < 0) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Inventory quantities must be zero or greater.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

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
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    inventory.quantityOnHand = quantityOnHand;
    inventory.reorderLevel = reorderLevel;
    inventory.lastModifiedDate = new Date();

    await this.inventoryRepo.save(inventory);

    return new CommandResult<number>({
      response: inventory.id,
      statusCode: HttpStatus.OK,
    });
  }
}
