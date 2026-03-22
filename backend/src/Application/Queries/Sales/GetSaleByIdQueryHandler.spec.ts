import { HttpStatus } from '@nestjs/common';
import { SaleStatus } from '../../../Domain/Entities/Sales/SaleHeader';
import { GetSaleByIdQueryHandler } from './GetSaleByIdQueryHandler';

describe('GetSaleByIdQueryHandler', () => {
  const getOne = jest.fn();
  const saleRepo = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getOne,
    })),
  };
  const salesReturnRepo = { find: jest.fn() };

  const handler = new GetSaleByIdQueryHandler(
    saleRepo as never,
    salesReturnRepo as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps line-level returned quantity, remaining returnable quantity, and refunded amount', async () => {
    getOne.mockResolvedValue({
      id: 10,
      tenantId: 1,
      branchId: 2,
      branch: { branchName: 'Main' },
      cashierId: 'cashier-1',
      cashier: { fullName: 'Jane Cashier' },
      customerId: 5,
      customer: { fullName: 'John Buyer' },
      receiptNo: 'SALE-1',
      grossAmount: 25,
      discountAmount: 0,
      taxAmount: 0,
      netAmount: 25,
      status: SaleStatus.PAID,
      saleDate: new Date('2026-03-21T10:00:00.000Z'),
      saleDetails: [
        {
          id: 100,
          variantId: 200,
          quantity: 2,
          unitPrice: 12.5,
          lineTotal: 25,
          variant: {
            unit: 'Bottle',
            barcode: '123',
            product: { id: 50, productName: 'Cola 1L', sku: 'SKU-1' },
          },
        },
      ],
      payments: [
        {
          id: 1,
          amount: 25,
          paymentMethod: 'CASH',
          dateCreated: new Date('2026-03-21T10:05:00.000Z'),
        },
      ],
    });

    salesReturnRepo.find.mockResolvedValue([
      {
        id: 500,
        saleId: 10,
        branchId: 2,
        branch: { branchName: 'Main' },
        processedById: 'cashier-1',
        processedBy: { fullName: 'Jane Cashier' },
        reasonCode: 'DAMAGED_ITEM',
        totalRefund: 12.5,
        returnDate: new Date('2026-03-21T11:00:00.000Z'),
        details: [
          {
            id: 900,
            saleDetailId: 100,
            quantity: 1,
            refundAmount: 12.5,
            saleDetail: {
              variantId: 200,
              variant: { product: { productName: 'Cola 1L', sku: 'SKU-1' } },
            },
          },
        ],
      },
    ]);

    const result = await handler.execute({ tenantId: 1, id: 10 });

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.response?.items).toEqual([
      expect.objectContaining({
        id: 100,
        returnedQuantity: 1,
        remainingReturnableQuantity: 1,
        refundedAmount: 12.5,
      }),
    ]);
    expect(result.response?.totalReturnedQuantity).toBe(1);
    expect(result.response?.totalRefundedAmount).toBe(12.5);
    expect(result.response?.refundableAmount).toBe(12.5);
  });
});
