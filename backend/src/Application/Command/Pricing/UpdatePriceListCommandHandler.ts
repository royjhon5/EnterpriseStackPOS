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
import { UpdatePriceListCommand } from './UpdatePriceListCommand';

@CommandHandler(UpdatePriceListCommand)
export class UpdatePriceListCommandHandler implements ICommandHandler<
  UpdatePriceListCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async execute(
    command: UpdatePriceListCommand,
  ): Promise<CommandResult<number>> {
    const priceList = await this.priceListRepo.findOne({
      where: { id: command.id, tenantId: command.tenantId, isDeleted: false },
    });

    if (!priceList) {
      return this.error('Price list not found.', HttpStatus.NOT_FOUND);
    }

    const validation = await this.validate(command.tenantId, command.priceList);
    if (validation) {
      return validation;
    }

    const savedId = await this.dataSource.transaction(async (manager) => {
      const priceListRepo = manager.getRepository(PriceList);
      const itemRepo = manager.getRepository(PriceListItem);

      priceList.branchId = command.priceList.branchId ?? null;
      priceList.effectiveFrom = command.priceList.effectiveFrom;
      priceList.effectiveTo = command.priceList.effectiveTo ?? null;
      priceList.lastModifiedDate = new Date();
      await priceListRepo.save(priceList);

      await itemRepo.delete({ priceListId: priceList.id });

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
      response: savedId,
      statusCode: HttpStatus.OK,
    });
  }

  private async validate(
    tenantId: number,
    dto: UpdatePriceListCommand['priceList'],
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

  private error(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ): CommandResult<number> {
    const error = new ValidationError(statusCode);
    error.message = message;
    return new CommandResult<number>({
      statusCode,
      validatorError: error,
    });
  }
}
