import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import {
  CashSession,
  CashSessionStatus,
} from '../../../Domain/Entities/CashManagement/CashManagement';
import {
  CashMovement,
  CashMovementType,
} from '../../../Domain/Entities/CashManagement/CashMovement';
import { CommandResult } from '../../CommandResult';
import { CreateCashMovementCommand } from './CreateCashMovementCommand';

@CommandHandler(CreateCashMovementCommand)
export class CreateCashMovementCommandHandler implements ICommandHandler<
  CreateCashMovementCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
    @InjectRepository(CashMovement)
    private readonly cashMovementRepo: Repository<CashMovement>,
  ) {}

  async execute(
    command: CreateCashMovementCommand,
  ): Promise<CommandResult<number>> {
    const amount = Number(command.movement.amount);
    const referenceNo = command.movement.referenceNo?.trim() || null;

    if (
      !Object.values(CashMovementType).includes(command.movement.movementType)
    ) {
      return this.validationError('Movement type is invalid.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return this.validationError('Amount must be greater than zero.');
    }

    const session = await this.cashSessionRepo.findOne({
      where: {
        id: command.sessionId,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!session) {
      return this.validationError(
        'Cash session not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (session.status !== CashSessionStatus.OPEN) {
      return this.validationError(
        'Cash movements can only be added to open sessions.',
        HttpStatus.CONFLICT,
      );
    }

    const movement = this.cashMovementRepo.create({
      sessionId: session.id,
      movementType: command.movement.movementType,
      amount,
      referenceNo: referenceNo ?? undefined,
    });

    const saved = await this.cashMovementRepo.save(movement);

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
