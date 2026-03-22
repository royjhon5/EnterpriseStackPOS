import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import {
  InventoryMovement,
  MovementType,
} from '../../../Domain/Entities/Inventory/InventoryMovement';
import { ProductVariant } from '../../../Domain/Entities/Product/ProductVariant';
import { SaleDetail } from '../../../Domain/Entities/Sales/SaleDetail';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { User } from '../../../Domain/Entities/User/User';
import { CommandResult } from '../../CommandResult';
import { CreateSaleCommand } from './CreateSaleCommand';

@CommandHandler(CreateSaleCommand)
export class CreateSaleCommandHandler implements ICommandHandler<
  CreateSaleCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(command: CreateSaleCommand): Promise<CommandResult<number>> {
    const items = command.sale.items ?? [];
    const discountAmount = command.sale.discountAmount ?? 0;
    const taxAmount = command.sale.taxAmount ?? 0;

    if (items.length === 0) {
      return this.validationResult('At least one sale line is required.');
    }

    if (discountAmount < 0 || taxAmount < 0) {
      return this.validationResult(
        'Discount and tax amounts must be zero or greater.',
      );
    }

    const branch = await this.branchRepo
      .createQueryBuilder('branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('branch.id = :branchId', { branchId: command.sale.branchId })
      .andWhere('branch.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!branch) {
      return this.validationResult('Branch does not exist for this tenant.');
    }

    const cashier = await this.userRepo.findOne({
      where: {
        id: command.cashierId,
        tenantId: command.tenantId,
        isActive: true,
      },
    });

    if (!cashier) {
      return this.validationResult('Cashier does not exist for this tenant.');
    }

    let customer: Customer | null = null;
    if (command.sale.customerId) {
      customer = await this.customerRepo.findOne({
        where: {
          id: command.sale.customerId,
          tenantId: command.tenantId,
          isDeleted: false,
        },
      });

      if (!customer) {
        return this.validationResult(
          'Customer does not exist for this tenant.',
        );
      }
    }

    const variantIds = [...new Set(items.map((item) => item.variantId))];
    const variants = await this.variantRepo
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('variant.id IN (:...variantIds)', { variantIds })
      .andWhere('variant.isDeleted = false')
      .andWhere('product.tenantId = :tenantId', { tenantId: command.tenantId })
      .andWhere('product.isDeleted = false')
      .getMany();

    if (variants.length !== variantIds.length) {
      return this.validationResult(
        'One or more product variants are invalid for this tenant.',
      );
    }

    const variantMap = new Map(
      variants.map((variant) => [variant.id, variant]),
    );
    const inventoryRecords = await this.inventoryRepo.find({
      where: {
        branchId: command.sale.branchId,
        isDeleted: false,
      },
      relations: { variant: true },
    });
    const inventoryMap = new Map(
      inventoryRecords.map((inventory) => [inventory.variantId, inventory]),
    );

    let grossAmount = 0;
    const preparedItems = [] as Array<{
      variant: ProductVariant;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      inventory: Inventory;
    }>;

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return this.validationResult(
          'Sale quantities must be whole numbers greater than zero.',
        );
      }

      const variant = variantMap.get(item.variantId);
      const inventory = inventoryMap.get(item.variantId);

      if (!variant || !inventory) {
        return this.validationResult(
          'Inventory is missing for one or more sale lines.',
        );
      }

      if (inventory.quantityOnHand < item.quantity) {
        return this.validationResult(
          `Insufficient inventory for variant ${item.variantId}.`,
        );
      }

      const unitPrice = Number(variant.sellingPrice);
      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      grossAmount = Number((grossAmount + lineTotal).toFixed(2));

      preparedItems.push({
        variant,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        inventory,
      });
    }

    const netAmount = Number(
      (grossAmount - discountAmount + taxAmount).toFixed(2),
    );
    if (netAmount < 0) {
      return this.validationResult('Net amount cannot be negative.');
    }

    const receiptNo = `SALE-${Date.now()}`;

    const saleId = await this.dataSource.transaction(async (manager) => {
      const saleRepo = manager.getRepository(SaleHeader);
      const saleDetailRepo = manager.getRepository(SaleDetail);
      const inventoryRepo = manager.getRepository(Inventory);
      const movementRepo = manager.getRepository(InventoryMovement);

      const sale = saleRepo.create({
        tenantId: command.tenantId,
        branchId: command.sale.branchId,
        cashierId: command.cashierId,
        customerId: customer?.id,
        receiptNo,
        grossAmount,
        discountAmount,
        taxAmount,
        netAmount,
        status: netAmount === 0 ? SaleStatus.PAID : SaleStatus.PENDING_PAYMENT,
      });

      await saleRepo.save(sale);

      for (const item of preparedItems) {
        const detail = saleDetailRepo.create({
          saleId: sale.id,
          variantId: item.variant.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        });
        await saleDetailRepo.save(detail);

        item.inventory.quantityOnHand -= item.quantity;
        item.inventory.lastModifiedDate = new Date();
        await inventoryRepo.save(item.inventory);

        const movement = movementRepo.create({
          branchId: command.sale.branchId,
          variantId: item.variant.id,
          movementType: MovementType.OUT,
          quantity: item.quantity,
          referenceNo: receiptNo,
        });
        await movementRepo.save(movement);
      }

      return sale.id;
    });

    return new CommandResult<number>({
      response: saleId,
      statusCode: HttpStatus.CREATED,
    });
  }

  private validationResult(message: string): CommandResult<number> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<number>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
