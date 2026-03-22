import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import {
  InventoryMovement,
  MovementType,
} from '../../../Domain/Entities/Inventory/InventoryMovement';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { CommandResult } from '../../CommandResult';
import { CreateInventoryMovementCommand } from './CreateInventoryMovementCommand';

@CommandHandler(CreateInventoryMovementCommand)
export class CreateInventoryMovementCommandHandler implements ICommandHandler<
  CreateInventoryMovementCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async execute(
    command: CreateInventoryMovementCommand,
  ): Promise<CommandResult<number>> {
    const { branchId, variantId, movementType, quantity, referenceNo } =
      command.movement;

    const normalizedReferenceNo = referenceNo?.trim() || undefined;
    const validationError = this.validateMovement(movementType, quantity);

    if (validationError) {
      return new CommandResult<number>({
        statusCode: validationError.statusCode,
        validatorError: validationError,
      });
    }

    const branch = await this.branchRepo
      .createQueryBuilder('branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('branch.id = :branchId', { branchId })
      .andWhere('branch.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!branch) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Branch does not exist for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const variant = await this.variantRepo
      .createQueryBuilder('variant')
      .leftJoin('variant.product', 'product')
      .where('variant.id = :variantId', { variantId })
      .andWhere('variant.isDeleted = false')
      .andWhere('product.tenantId = :tenantId', { tenantId: command.tenantId })
      .andWhere('product.isDeleted = false')
      .getOne();

    if (!variant) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Product variant does not exist for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const inventory = await this.inventoryRepo.findOne({
      where: {
        branchId,
        variantId,
        isDeleted: false,
      },
    });

    if (!inventory) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message =
        'Inventory record does not exist for this branch and variant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const quantityDelta =
      movementType === MovementType.OUT ? -quantity : quantity;
    const nextQuantityOnHand = inventory.quantityOnHand + quantityDelta;

    if (nextQuantityOnHand < 0) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message =
        'Inventory movement would result in negative quantity on hand.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    const movementId = await this.dataSource.transaction(async (manager) => {
      const movementRepo = manager.getRepository(InventoryMovement);
      const transactionalInventoryRepo = manager.getRepository(Inventory);

      inventory.quantityOnHand = nextQuantityOnHand;
      inventory.lastModifiedDate = new Date();
      await transactionalInventoryRepo.save(inventory);

      const movement = movementRepo.create({
        branchId,
        variantId,
        movementType,
        quantity,
        referenceNo: normalizedReferenceNo,
      });

      await movementRepo.save(movement);
      return movement.id;
    });

    return new CommandResult<number>({
      response: movementId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private validateMovement(
    movementType: MovementType,
    quantity: number,
  ): ValidationError | null {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);

    if (!Object.values(MovementType).includes(movementType)) {
      error.message = 'Movement type is invalid.';
      return error;
    }

    if (!Number.isInteger(quantity)) {
      error.message = 'Quantity must be a whole number.';
      return error;
    }

    if (movementType === MovementType.ADJUSTMENT) {
      if (quantity === 0) {
        error.message = 'Adjustment quantity cannot be zero.';
        return error;
      }

      return null;
    }

    if (quantity <= 0) {
      error.message = 'Movement quantity must be greater than zero.';
      return error;
    }

    return null;
  }
}
