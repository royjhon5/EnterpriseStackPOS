import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import {
  CashSession,
  CashSessionStatus,
} from '../../../Domain/Entities/CashManagement/CashManagement';
import { User } from '../../../Domain/Entities/User/User';
import { CommandResult } from '../../CommandResult';
import { OpenCashSessionCommand } from './OpenCashSessionCommand';

@CommandHandler(OpenCashSessionCommand)
export class OpenCashSessionCommandHandler implements ICommandHandler<
  OpenCashSessionCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(
    command: OpenCashSessionCommand,
  ): Promise<CommandResult<number>> {
    const openingBalance = Number(command.session.openingBalance);

    if (!Number.isFinite(openingBalance) || openingBalance < 0) {
      return this.validationError('Opening balance must be zero or greater.');
    }

    const branch = await this.branchRepo.findOne({
      where: {
        id: command.session.branchId,
        tenant: { id: command.tenantId },
        isDeleted: false,
      },
      relations: ['tenant'],
    });

    if (!branch) {
      return this.validationError(
        'Branch not found for this tenant.',
        HttpStatus.NOT_FOUND,
      );
    }

    const cashier = await this.userRepo.findOne({
      where: {
        id: command.session.cashierId,
        tenantId: command.tenantId,
        isActive: true,
      },
    });

    if (!cashier) {
      return this.validationError(
        'Cashier not found for this tenant.',
        HttpStatus.NOT_FOUND,
      );
    }

    const existingOpenSession = await this.cashSessionRepo.findOne({
      where: {
        tenantId: command.tenantId,
        branchId: command.session.branchId,
        cashierId: command.session.cashierId,
        status: CashSessionStatus.OPEN,
        isDeleted: false,
      },
    });

    if (existingOpenSession) {
      return this.validationError(
        'An open cash session already exists for this cashier and branch.',
        HttpStatus.CONFLICT,
      );
    }

    const session = this.cashSessionRepo.create({
      tenantId: command.tenantId,
      branchId: command.session.branchId,
      cashierId: command.session.cashierId,
      openingBalance,
      status: CashSessionStatus.OPEN,
      openedAt: new Date(),
    });

    const saved = await this.cashSessionRepo.save(session);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.CREATED,
    });
  }

  private validationError(
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
