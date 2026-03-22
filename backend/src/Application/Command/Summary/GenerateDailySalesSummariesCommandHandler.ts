import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import {
  SaleHeader,
  SaleStatus,
} from '../../../Domain/Entities/Sales/SaleHeader';
import { DailySalesSummary } from '../../../Domain/Entities/Summary/DailySales';
import { CommandResult } from '../../CommandResult';
import { GenerateDailySalesSummariesCommand } from './GenerateDailySalesSummariesCommand';

@CommandHandler(GenerateDailySalesSummariesCommand)
export class GenerateDailySalesSummariesCommandHandler implements ICommandHandler<
  GenerateDailySalesSummariesCommand,
  CommandResult<number>
> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SaleHeader)
    private readonly saleRepo: Repository<SaleHeader>,
    @InjectRepository(DailySalesSummary)
    private readonly summaryRepo: Repository<DailySalesSummary>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async execute(
    command: GenerateDailySalesSummariesCommand,
  ): Promise<CommandResult<number>> {
    const dateFrom = this.parseDate(command.summary.dateFrom, 'dateFrom');
    if (dateFrom instanceof ValidationError) {
      return this.error(dateFrom.message, HttpStatus.BAD_REQUEST);
    }

    const dateTo = this.parseDate(command.summary.dateTo, 'dateTo');
    if (dateTo instanceof ValidationError) {
      return this.error(dateTo.message, HttpStatus.BAD_REQUEST);
    }

    if (dateFrom > dateTo) {
      return this.error('dateFrom must be earlier than or equal to dateTo.');
    }

    if (command.summary.branchId) {
      const branch = await this.branchRepo
        .createQueryBuilder('branch')
        .leftJoin('branch.tenant', 'tenant')
        .where('branch.id = :branchId', { branchId: command.summary.branchId })
        .andWhere('branch.isDeleted = false')
        .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
        .getOne();

      if (!branch) {
        return this.error('Branch does not exist for this tenant.');
      }
    }

    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.isDeleted = false')
      .andWhere('sale.tenantId = :tenantId', { tenantId: command.tenantId })
      .andWhere('sale.saleDate >= :dateFrom', {
        dateFrom: this.startOfDay(dateFrom),
      })
      .andWhere('sale.saleDate <= :dateTo', { dateTo: this.endOfDay(dateTo) })
      .andWhere('sale.status != :voidedStatus', {
        voidedStatus: SaleStatus.VOIDED,
      });

    if (command.summary.branchId) {
      qb.andWhere('sale.branchId = :branchId', {
        branchId: command.summary.branchId,
      });
    }

    const sales = await qb.getMany();
    const grouped = new Map<
      string,
      {
        branchId: number;
        salesDate: string;
        totalSales: number;
        totalTax: number;
        totalDiscount: number;
      }
    >();

    for (const sale of sales) {
      if (!sale.branchId) {
        continue;
      }

      const salesDate = new Date(sale.saleDate).toISOString().slice(0, 10);
      const key = `${sale.branchId}:${salesDate}`;
      const current = grouped.get(key) ?? {
        branchId: sale.branchId,
        salesDate,
        totalSales: 0,
        totalTax: 0,
        totalDiscount: 0,
      };

      current.totalSales = Number(
        (current.totalSales + Number(sale.netAmount)).toFixed(2),
      );
      current.totalTax = Number(
        (current.totalTax + Number(sale.taxAmount)).toFixed(2),
      );
      current.totalDiscount = Number(
        (current.totalDiscount + Number(sale.discountAmount)).toFixed(2),
      );
      grouped.set(key, current);
    }

    const affectedCount = await this.dataSource.transaction(async (manager) => {
      const summaryRepo = manager.getRepository(DailySalesSummary);
      let count = 0;

      for (const summary of grouped.values()) {
        let record = await summaryRepo.findOne({
          where: {
            branchId: summary.branchId,
            salesDate: summary.salesDate,
            isDeleted: false,
          },
        });

        if (!record) {
          record = summaryRepo.create({
            branchId: summary.branchId,
            salesDate: summary.salesDate,
          });
        }

        record.totalSales = summary.totalSales;
        record.totalTax = summary.totalTax;
        record.totalDiscount = summary.totalDiscount;
        await summaryRepo.save(record);
        count += 1;
      }

      return count;
    });

    return new CommandResult<number>({
      response: affectedCount,
      statusCode: HttpStatus.OK,
    });
  }

  private parseDate(value: string, fieldName: string): Date | ValidationError {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = `${fieldName} must be a valid date string.`;
      return error;
    }

    return parsed;
  }

  private startOfDay(date: Date): Date {
    const value = new Date(date);
    value.setUTCHours(0, 0, 0, 0);
    return value;
  }

  private endOfDay(date: Date): Date {
    const value = new Date(date);
    value.setUTCHours(23, 59, 59, 999);
    return value;
  }

  private error(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ): CommandResult<number> {
    const error = new ValidationError(statusCode);
    error.message = message;
    return new CommandResult<number>({ statusCode, validatorError: error });
  }
}
