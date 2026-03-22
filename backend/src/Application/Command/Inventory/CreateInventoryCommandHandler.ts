import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { CommandResult } from '../../CommandResult';
import { CreateInventoryCommand } from './CreateInventoryCommand';

@CommandHandler(CreateInventoryCommand)
export class CreateInventoryCommandHandler implements ICommandHandler<
  CreateInventoryCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async execute(
    command: CreateInventoryCommand,
  ): Promise<CommandResult<number>> {
    const { branchId, variantId, quantityOnHand, reorderLevel } =
      command.inventory;

    if (quantityOnHand < 0 || reorderLevel < 0) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Inventory quantities must be zero or greater.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
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

    const existing = await this.inventoryRepo.findOne({
      where: {
        branchId,
        variantId,
        isDeleted: false,
      },
    });

    if (existing) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'Inventory already exists for this branch and variant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    const inventory = this.inventoryRepo.create({
      branchId,
      variantId,
      quantityOnHand,
      reorderLevel,
    });

    await this.inventoryRepo.save(inventory);

    return new CommandResult<number>({
      response: inventory.id,
      statusCode: HttpStatus.CREATED,
    });
  }
}
