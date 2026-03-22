import { HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SaleStatus } from '../../../Domain/Entities/Sales/SaleHeader';
import { CreateSalesReturnCommand } from './CreateSalesReturnCommand';
import { CreateSalesReturnCommandHandler } from './CreateSalesReturnCommandHandler';

describe('CreateSalesReturnCommandHandler', () => {
  const saleRepo = { findOne: jest.fn() };
  const userRepo = { findOne: jest.fn() };
  const saleDetailRepo = { createQueryBuilder: jest.fn(), find: jest.fn() };
  const salesReturnDetailRepo = { createQueryBuilder: jest.fn() };
  const salesReturnRepo = { find: jest.fn() };
  const paymentRepo = { find: jest.fn() };
  const inventoryRepo = { find: jest.fn() };
  const transactionMock = jest.fn();
  const dataSource = {
    transaction: transactionMock,
  } as unknown as DataSource;

  const handler = new CreateSalesReturnCommandHandler(
    dataSource,
    saleRepo as never,
    userRepo as never,
    saleDetailRepo as never,
    salesReturnDetailRepo as never,
    salesReturnRepo as never,
    paymentRepo as never,
    inventoryRepo as never,
  );

  const command = new CreateSalesReturnCommand(1, 'user-1', {
    saleId: 10,
    reasonCode: 'DAMAGED_ITEM',
    items: [{ saleDetailId: 100, quantity: 1 }],
  });

  beforeEach(() => {
    jest.clearAllMocks();

    saleRepo.findOne.mockResolvedValue({
      id: 10,
      tenantId: 1,
      branchId: 2,
      receiptNo: 'SALE-1',
      netAmount: 50,
      status: SaleStatus.PAID,
      isDeleted: false,
    });
    userRepo.findOne.mockResolvedValue({
      id: 'user-1',
      tenantId: 1,
      isActive: true,
    });
    saleDetailRepo.createQueryBuilder.mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        {
          id: 100,
          saleId: 10,
          variantId: 200,
          quantity: 2,
          unitPrice: 12.5,
        },
      ]),
    });
    saleDetailRepo.find.mockResolvedValue([
      { id: 100, saleId: 10, variantId: 200, quantity: 2 },
    ]);
    salesReturnDetailRepo.createQueryBuilder.mockReturnValue({
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    });
    salesReturnRepo.find.mockResolvedValue([]);
    inventoryRepo.find.mockResolvedValue([
      { variantId: 200, quantityOnHand: 10 },
    ]);
  });

  it('rejects refunds when no payment has been captured', async () => {
    paymentRepo.find.mockResolvedValue([]);

    const result = await handler.execute(command);

    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.validatorError?.message).toBe(
      'Refunds cannot be processed until payment has been captured for this sale.',
    );
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it('rejects refunds that exceed the remaining refundable balance', async () => {
    paymentRepo.find.mockResolvedValue([{ amount: 10 }]);
    salesReturnRepo.find.mockResolvedValue([{ totalRefund: 8 }]);

    const result = await handler.execute(command);

    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.validatorError?.message).toBe(
      'Refund amount exceeds remaining refundable balance of 2.00.',
    );
    expect(transactionMock).not.toHaveBeenCalled();
  });
});
