import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { PriceList } from '../../../Domain/Entities/Pricing/PricingList';
import { PriceListItem } from '../../../Domain/Entities/Pricing/PricingListItem';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { CommandResult } from '../../CommandResult';
import { CreatePriceListCommand } from './CreatePriceListCommand';

@CommandHandler(CreatePriceListCommand)
export class CreatePriceListCommandHandler implements ICommandHandler<
  CreatePriceListCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async execute(
    command: CreatePriceListCommand,
  ): Promise<CommandResult<number>> {
    const validation = await this.validate(command.tenantId, command.priceList);
    if (validation) {
      return validation;
    }

    const priceListId = await this.dataSource.transaction(async (manager) => {
      const priceListRepo = manager.getRepository(PriceList);
      const itemRepo = manager.getRepository(PriceListItem);

      const priceList = priceListRepo.create({
        tenantId: command.tenantId,
        branchId: command.priceList.branchId ?? null,
        effectiveFrom: command.priceList.effectiveFrom,
        effectiveTo: command.priceList.effectiveTo ?? null,
      });
      await priceListRepo.save(priceList);

      const items = command.priceList.items.map((item) =>
        itemRepo.create({
          priceListId: priceList.id,
          variantId: item.variantId,
          sellingPrice: Number(item.sellingPrice),
        }),
      );
      await itemRepo.save(items);

      return priceList.id;
    });

    return new CommandResult<number>({
      response: priceListId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private async validate(
    tenantId: number,
    dto: CreatePriceListCommand['priceList'],
  ): Promise<CommandResult<number> | null> {
    if (!dto.items?.length) {
      return this.error('Price list must contain at least one item.');
    }

    const variantIds = dto.items.map((item) => item.variantId);
    if (new Set(variantIds).size !== variantIds.length) {
      return this.error('Price list cannot contain duplicate variants.');
    }

    if (
      dto.items.some(
        (item) =>
          !Number.isFinite(Number(item.sellingPrice)) ||
          Number(item.sellingPrice) < 0,
      )
    ) {
      return this.error('Selling price must be zero or greater.');
    }

    if (
      dto.effectiveTo &&
      new Date(dto.effectiveTo) < new Date(dto.effectiveFrom)
    ) {
      return this.error(
        'Effective to date must be on or after effective from date.',
      );
    }

    if (dto.branchId) {
      const branch = await this.branchRepo
        .createQueryBuilder('branch')
        .leftJoin('branch.tenant', 'tenant')
        .where('branch.id = :branchId', { branchId: dto.branchId })
        .andWhere('branch.isDeleted = false')
        .andWhere('tenant.id = :tenantId', { tenantId })
        .getOne();

      if (!branch) {
        return this.error('Branch does not exist for this tenant.');
      }
    }

    const variants = await this.variantRepo
      .createQueryBuilder('variant')
      .leftJoin('variant.product', 'product')
      .where('variant.id IN (:...variantIds)', { variantIds })
      .andWhere('variant.isDeleted = false')
      .andWhere('product.tenantId = :tenantId', { tenantId })
      .andWhere('product.isDeleted = false')
      .getMany();

    if (variants.length !== variantIds.length) {
      return this.error('One or more variants do not exist for this tenant.');
    }

    return null;
  }

  private error(message: string): CommandResult<number> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<number>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
