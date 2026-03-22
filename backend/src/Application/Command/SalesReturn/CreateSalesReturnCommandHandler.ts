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
import { SalesReturnDetail } from '../../../Domain/Entities/SalesReturn/SalesReturnDetail';
import { Payment } from '../../../Domain/Entities/Transaction/Payment';
import { User } from '../../../Domain/Entities/User/User';
import { CommandResult } from '../../CommandResult';
import { CreateSalesReturnCommand } from './CreateSalesReturnCommand';

@CommandHandler(CreateSalesReturnCommand)
export class CreateSalesReturnCommandHandler implements ICommandHandler<
  CreateSalesReturnCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SaleDetail)
    private readonly saleDetailRepo: Repository<SaleDetail>,
    @InjectRepository(SalesReturnDetail)
    private readonly salesReturnDetailRepo: Repository<SalesReturnDetail>,
    @InjectRepository(SalesReturn)
    private readonly salesReturnRepo: Repository<SalesReturn>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async execute(
    command: CreateSalesReturnCommand,
  ): Promise<CommandResult<number>> {
    const items = command.salesReturn.items ?? [];
    const reasonCode = command.salesReturn.reasonCode?.trim();

    if (!reasonCode) {
      return this.validationResult('Reason code is required.');
    }

    if (items.length === 0) {
      return this.validationResult('At least one return line is required.');
    }

    const sale = await this.saleRepo.findOne({
      where: {
        id: command.salesReturn.saleId,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!sale) {
      return this.validationResult('Sale does not exist for this tenant.');
    }

    if (sale.status === SaleStatus.VOIDED) {
      return this.validationResult('Voided sales cannot be returned.');
    }

    const processedBy = await this.userRepo.findOne({
      where: {
        id: command.processedById,
        tenantId: command.tenantId,
        isActive: true,
      },
    });

    if (!processedBy) {
      return this.validationResult(
        'Processing user does not exist for this tenant.',
      );
    }

    const saleDetailIds = [...new Set(items.map((item) => item.saleDetailId))];
    const requestedSaleDetails = await this.saleDetailRepo
      .createQueryBuilder('detail')
      .leftJoinAndSelect('detail.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('detail.id IN (:...saleDetailIds)', { saleDetailIds })
      .andWhere('detail.saleId = :saleId', { saleId: sale.id })
      .andWhere('detail.isDeleted = false')
      .getMany();

    if (requestedSaleDetails.length !== saleDetailIds.length) {
      return this.validationResult(
        'One or more sale detail lines are invalid for this sale.',
      );
    }

    const allSaleDetails = await this.saleDetailRepo.find({
      where: { saleId: sale.id, isDeleted: false },
    });

    const existingReturnDetails = await this.salesReturnDetailRepo
      .createQueryBuilder('returnDetail')
      .leftJoin('returnDetail.saleDetail', 'saleDetail')
      .leftJoin('returnDetail.salesReturn', 'salesReturn')
      .where('saleDetail.saleId = :saleId', { saleId: sale.id })
      .andWhere('returnDetail.isDeleted = false')
      .andWhere('salesReturn.isDeleted = false')
      .getMany();

    const alreadyReturnedBySaleDetailId = new Map<number, number>();
    for (const detail of existingReturnDetails) {
      const current =
        alreadyReturnedBySaleDetailId.get(detail.saleDetailId) ?? 0;
      alreadyReturnedBySaleDetailId.set(
        detail.saleDetailId,
        current + detail.quantity,
      );
    }

    const requestedSaleDetailMap = new Map(
      requestedSaleDetails.map((detail) => [detail.id, detail]),
    );
    const inventoryRecords = await this.inventoryRepo.find({
      where: { branchId: sale.branchId, isDeleted: false },
    });
    const inventoryMap = new Map(
      inventoryRecords.map((inventory) => [inventory.variantId, inventory]),
    );

    const existingSalesReturns = await this.salesReturnRepo.find({
      where: { saleId: sale.id, isDeleted: false },
    });
    const totalRefundedBefore = Number(
      existingSalesReturns
        .reduce((sum, salesReturn) => sum + Number(salesReturn.totalRefund), 0)
        .toFixed(2),
    );

    const payments = await this.paymentRepo.find({
      where: { saleId: sale.id, isDeleted: false },
    });
    const totalPaid = Number(
      payments
        .reduce((sum, payment) => sum + Number(payment.amount), 0)
        .toFixed(2),
    );

    let totalRefund = 0;
    const returnQtyBySaleDetailId = new Map<number, number>();
    const preparedLines = [] as Array<{
      saleDetail: SaleDetail;
      quantity: number;
      refundAmount: number;
      inventory: Inventory;
    }>;

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return this.validationResult(
          'Return quantities must be whole numbers greater than zero.',
        );
      }

      const saleDetail = requestedSaleDetailMap.get(item.saleDetailId);
      if (!saleDetail) {
        return this.validationResult(
          'One or more sale detail lines are invalid for this sale.',
        );
      }

      const inventory = inventoryMap.get(saleDetail.variantId);
      if (!inventory) {
        return this.validationResult(
          'Inventory is missing for one or more return lines.',
        );
      }

      const alreadyReturned =
        alreadyReturnedBySaleDetailId.get(saleDetail.id) ?? 0;
      const requestedForLine = returnQtyBySaleDetailId.get(saleDetail.id) ?? 0;
      const nextReturnedQuantity =
        alreadyReturned + requestedForLine + item.quantity;

      if (nextReturnedQuantity > saleDetail.quantity) {
        return this.validationResult(
          `Return quantity exceeds sold quantity for sale detail ${saleDetail.id}.`,
        );
      }

      const refundAmount = Number(
        (Number(saleDetail.unitPrice) * item.quantity).toFixed(2),
      );
      totalRefund = Number((totalRefund + refundAmount).toFixed(2));
      returnQtyBySaleDetailId.set(
        saleDetail.id,
        requestedForLine + item.quantity,
      );

      preparedLines.push({
        saleDetail,
        quantity: item.quantity,
        refundAmount,
        inventory,
      });
    }

    const maxRefundableAmount = Number(
      Math.min(totalPaid, Number(sale.netAmount)).toFixed(2),
    );

    if (maxRefundableAmount <= 0) {
      return this.validationResult(
        'Refunds cannot be processed until payment has been captured for this sale.',
      );
    }

    const remainingRefundableAmount = Number(
      Math.max(maxRefundableAmount - totalRefundedBefore, 0).toFixed(2),
    );

    if (totalRefund - remainingRefundableAmount > 0.0001) {
      return this.validationResult(
        `Refund amount exceeds remaining refundable balance of ${remainingRefundableAmount.toFixed(2)}.`,
      );
    }

    const fullyRefunded = allSaleDetails.every((detail) => {
      const alreadyReturned = alreadyReturnedBySaleDetailId.get(detail.id) ?? 0;
      const requested = returnQtyBySaleDetailId.get(detail.id) ?? 0;
      return alreadyReturned + requested >= detail.quantity;
    });

    const salesReturnId = await this.dataSource.transaction(async (manager) => {
      const salesReturnRepo = manager.getRepository(SalesReturn);
      const salesReturnDetailRepo = manager.getRepository(SalesReturnDetail);
      const inventoryRepo = manager.getRepository(Inventory);
      const movementRepo = manager.getRepository(InventoryMovement);
      const saleRepo = manager.getRepository(SaleHeader);

      const salesReturn = salesReturnRepo.create({
        saleId: sale.id,
        branchId: sale.branchId,
        processedById: command.processedById,
        reasonCode,
        totalRefund,
      });
      await salesReturnRepo.save(salesReturn);

      for (const line of preparedLines) {
        const returnDetail = salesReturnDetailRepo.create({
          salesReturnId: salesReturn.id,
          saleDetailId: line.saleDetail.id,
          quantity: line.quantity,
          refundAmount: line.refundAmount,
        });
        await salesReturnDetailRepo.save(returnDetail);

        line.inventory.quantityOnHand += line.quantity;
        line.inventory.lastModifiedDate = new Date();
        await inventoryRepo.save(line.inventory);

        const movement = movementRepo.create({
          branchId: sale.branchId,
          variantId: line.saleDetail.variantId,
          movementType: MovementType.IN,
          quantity: line.quantity,
          referenceNo: `${sale.receiptNo}-RETURN-${salesReturn.id}`,
        });
        await movementRepo.save(movement);
      }

      if (fullyRefunded) {
        sale.status = SaleStatus.REFUNDED;
        sale.lastModifiedDate = new Date();
        await saleRepo.save(sale);
      }

      return salesReturn.id;
    });

    return new CommandResult<number>({
      response: salesReturnId,
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
