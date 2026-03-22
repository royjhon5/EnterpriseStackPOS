import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import {
  InventoryCount,
  InventoryCountStatus,
} from '../../../Domain/Entities/Inventory/InventoryCount';
import { InventoryCountDetail } from '../../../Domain/Entities/Inventory/InventoryCountDetail';
import {
  InventoryMovement,
  MovementType,
} from '../../../Domain/Entities/Inventory/InventoryMovement';
import { CommandResult } from '../../CommandResult';
import { PostInventoryCountCommand } from './PostInventoryCountCommand';

@CommandHandler(PostInventoryCountCommand)
export class PostInventoryCountCommandHandler implements ICommandHandler<
  PostInventoryCountCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryCount)
    private readonly inventoryCountRepo: Repository<InventoryCount>,
  ) {}

  async execute(
    command: PostInventoryCountCommand,
  ): Promise<CommandResult<number>> {
    const count = await this.inventoryCountRepo.findOne({
      where: {
        id: command.id,
        isDeleted: false,
      },
      relations: ['branch', 'branch.tenant', 'details'],
    });

    if (!count || count.branch?.tenant?.id !== command.tenantId) {
      return this.validationError(
        'Inventory count not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (count.status !== InventoryCountStatus.DRAFT) {
      return this.validationError(
        'Only draft inventory counts can be posted.',
        HttpStatus.CONFLICT,
      );
    }

    const countId = await this.dataSource.transaction(async (manager) => {
      const detailRepo = manager.getRepository(InventoryCountDetail);
      const inventoryRepo = manager.getRepository(Inventory);
      const movementRepo = manager.getRepository(InventoryMovement);
      const countRepo = manager.getRepository(InventoryCount);

      const details = await detailRepo.find({
        where: { inventoryCountId: count.id, isDeleted: false },
      });

      for (const detail of details) {
        const inventory = await inventoryRepo.findOne({
          where: {
            branchId: count.branchId,
            variantId: detail.variantId,
            isDeleted: false,
          },
        });

        if (!inventory) {
          throw new Error(
            `Inventory record missing for branch ${count.branchId} and variant ${detail.variantId}.`,
          );
        }

        const adjustmentQty = detail.countedQty - inventory.quantityOnHand;
        inventory.quantityOnHand = detail.countedQty;
        inventory.lastModifiedDate = new Date();
        await inventoryRepo.save(inventory);

        detail.variance = detail.countedQty - detail.systemQty;
        detail.lastModifiedDate = new Date();
        await detailRepo.save(detail);

        if (adjustmentQty !== 0) {
          const movement = movementRepo.create({
            branchId: count.branchId,
            variantId: detail.variantId,
            movementType: MovementType.ADJUSTMENT,
            quantity: adjustmentQty,
            referenceNo: `COUNT-${count.id}`,
          });

          await movementRepo.save(movement);
        }
      }

      count.status = InventoryCountStatus.POSTED;
      count.lastModifiedDate = new Date();
      await countRepo.save(count);
      return count.id;
    });

    return new CommandResult<number>({
      response: countId,
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
