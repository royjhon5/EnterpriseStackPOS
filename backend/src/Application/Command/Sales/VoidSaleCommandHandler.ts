import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Inventory } from '../../../Domain/Entities/Inventory/Inventory';
import {
  InventoryMovement,
  MovementType,
} from '../../../Domain/Entities/Inventory/InventoryMovement';
import { SaleDetail } from '../../../Domain/Entities/Sales/SaleDetail';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { SalesReturn } from '../../../Domain/Entities/SalesReturn/SalesReturn';
import { Payment } from '../../../Domain/Entities/Transaction/Payment';
import { User } from '../../../Domain/Entities/User/User';
import { CommandResult } from '../../CommandResult';
import { VoidSaleCommand } from './VoidSaleCommand';

@CommandHandler(VoidSaleCommand)
export class VoidSaleCommandHandler implements ICommandHandler<
  VoidSaleCommand,
  CommandResult<boolean>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SaleDetail)
    private readonly saleDetailRepo: Repository<SaleDetail>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
  ) {}

  async execute(command: VoidSaleCommand): Promise<CommandResult<boolean>> {
    const sale = await this.saleRepo.findOne({
      where: {
        id: command.saleId,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!sale) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Sale not found.';
      return new CommandResult<boolean>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    if (sale.status === SaleStatus.VOIDED) {
      return this.validationResult('Sale has already been voided.');
    }

    if (sale.status === SaleStatus.REFUNDED) {
      return this.validationResult('Refunded sales cannot be voided.');
    }

    const voidingUser = await this.userRepo.findOne({
      where: {
        id: command.voidedById,
        tenantId: command.tenantId,
        isActive: true,
      },
    });

    if (!voidingUser) {
      return this.validationResult(
        'Voiding user does not exist for this tenant.',
      );
    }

    const paymentCount = await this.paymentRepo.count({
      where: { saleId: sale.id, isDeleted: false },
    });

    if (paymentCount > 0) {
      return this.validationResult(
        'Paid or partially paid sales cannot be voided.',
      );
    }

    const salesReturnCount = await this.salesReturnRepo.count({
      where: { saleId: sale.id, isDeleted: false },
    });

    if (salesReturnCount > 0) {
      return this.validationResult('Returned sales cannot be voided.');
    }

    const saleDetails = await this.saleDetailRepo.find({
      where: { saleId: sale.id, isDeleted: false },
    });

    if (saleDetails.length === 0) {
      return this.validationResult('Sale does not contain any lines to void.');
    }

    const variantIds = [
      ...new Set(saleDetails.map((detail) => detail.variantId)),
    ];
    const inventoryRecords = await this.inventoryRepo.find({
      where: {
        branchId: sale.branchId,
        isDeleted: false,
      },
    });
    const inventoryMap = new Map(
      inventoryRecords.map((inventory) => [inventory.variantId, inventory]),
    );

    for (const variantId of variantIds) {
      if (!inventoryMap.has(variantId)) {
        return this.validationResult(
          'Inventory is missing for one or more sale lines.',
        );
      }
    }

    await this.dataSource.transaction(async (manager) => {
      const saleRepo = manager.getRepository(SaleHeader);
      const inventoryRepo = manager.getRepository(Inventory);
      const movementRepo = manager.getRepository(InventoryMovement);

      for (const detail of saleDetails) {
        const inventory = inventoryMap.get(detail.variantId)!;
        inventory.quantityOnHand += detail.quantity;
        inventory.lastModifiedDate = new Date();
        await inventoryRepo.save(inventory);

        const movement = movementRepo.create({
          branchId: sale.branchId,
          variantId: detail.variantId,
          movementType: MovementType.IN,
          quantity: detail.quantity,
          referenceNo: `${sale.receiptNo}-VOID`,
        });
        await movementRepo.save(movement);
      }

      sale.status = SaleStatus.VOIDED;
      sale.lastModifiedDate = new Date();
      await saleRepo.save(sale);
    });

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }

  private validationResult(message: string): CommandResult<boolean> {
    const error = new ValidationError(HttpStatus.BAD_REQUEST);
    error.message = message;
    return new CommandResult<boolean>({
      statusCode: HttpStatus.BAD_REQUEST,
      validatorError: error,
    });
  }
}
