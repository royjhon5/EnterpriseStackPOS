import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import {
  InventoryCount,
  InventoryCountStatus,
} from '../../../Domain/Entities/Inventory/InventoryCount';
import { InventoryCountDetail } from '../../../Domain/Entities/Inventory/InventoryCountDetail';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { CommandResult } from '../../CommandResult';
import { CreateInventoryCountCommand } from './CreateInventoryCountCommand';

@CommandHandler(CreateInventoryCountCommand)
export class CreateInventoryCountCommandHandler implements ICommandHandler<
  CreateInventoryCountCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async execute(
    command: CreateInventoryCountCommand,
  ): Promise<CommandResult<number>> {
    const { branchId, countDate, details } = command.count;

    if (!details?.length) {
      return this.validationError(
        'Inventory count must include at least one detail line.',
      );
    }

    const detailVariantIds = details.map((detail) => detail.variantId);
    if (new Set(detailVariantIds).size !== detailVariantIds.length) {
      return this.validationError(
        'Inventory count cannot contain duplicate variants.',
      );
    }

    if (
      details.some(
        (detail) =>
          !Number.isInteger(detail.countedQty) || detail.countedQty < 0,
      )
    ) {
      return this.validationError(
        'Counted quantity must be a whole number that is zero or greater.',
      );
    }

    const branch = await this.branchRepo
      .createQueryBuilder('branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('branch.id = :branchId', { branchId })
      .andWhere('branch.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!branch) {
      return this.validationError('Branch does not exist for this tenant.');
    }

    const variants = await this.variantRepo
      .createQueryBuilder('variant')
      .leftJoin('variant.product', 'product')
      .where('variant.id IN (:...variantIds)', { variantIds: detailVariantIds })
      .andWhere('variant.isDeleted = false')
      .andWhere('product.tenantId = :tenantId', { tenantId: command.tenantId })
      .andWhere('product.isDeleted = false')
      .getMany();

    if (variants.length !== detailVariantIds.length) {
      return this.validationError(
        'One or more variants do not exist for this tenant.',
      );
    }

    const inventories = await this.inventoryRepo.find({
      where: {
        branchId,
        variantId: In(detailVariantIds),
        isDeleted: false,
      },
    });

    if (inventories.length !== detailVariantIds.length) {
      return this.validationError(
        'One or more inventory records do not exist for the selected branch and variants.',
      );
    }

    const inventoryByVariantId = new Map(
      inventories.map((inventory) => [inventory.variantId, inventory]),
    );

    const countId = await this.dataSource.transaction(async (manager) => {
      const countRepo = manager.getRepository(InventoryCount);
      const detailRepo = manager.getRepository(InventoryCountDetail);

      const count = countRepo.create({
        branchId,
        countDate,
        status: InventoryCountStatus.DRAFT,
      });

      await countRepo.save(count);

      const countDetails = details.map((detail) => {
        const inventory = inventoryByVariantId.get(detail.variantId)!;
        const variance = detail.countedQty - inventory.quantityOnHand;

        return detailRepo.create({
          inventoryCountId: count.id,
          variantId: detail.variantId,
          systemQty: inventory.quantityOnHand,
          countedQty: detail.countedQty,
          variance,
        });
      });

      await detailRepo.save(countDetails);
      return count.id;
    });

    return new CommandResult<number>({
      response: countId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private validationError(message: string): CommandResult<number> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<number>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
