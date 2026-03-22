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
import { CloseCashSessionCommand } from './CloseCashSessionCommand';

@CommandHandler(CloseCashSessionCommand)
export class CloseCashSessionCommandHandler implements ICommandHandler<
  CloseCashSessionCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
    @InjectRepository(CashMovement)
    private readonly cashMovementRepo: Repository<CashMovement>,
  ) {}

  async execute(
    command: CloseCashSessionCommand,
  ): Promise<CommandResult<number>> {
    const closingBalance = Number(command.session.closingBalance);

    if (!Number.isFinite(closingBalance) || closingBalance < 0) {
      return this.validationError('Closing balance must be zero or greater.');
    }

    const session = await this.cashSessionRepo.findOne({
      where: {
        id: command.id,
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

    if (session.status === CashSessionStatus.CLOSED) {
      return this.validationError(
        'Cash session is already closed.',
        HttpStatus.CONFLICT,
      );
    }

    const movements = await this.cashMovementRepo.find({
      where: {
        sessionId: session.id,
        isDeleted: false,
      },
    });

    const movementDelta = movements.reduce((sum, movement) => {
      const amount = Number(movement.amount);
      if (
        movement.movementType === CashMovementType.REFUND ||
        movement.movementType === CashMovementType.DROP ||
        movement.movementType === CashMovementType.PAYOUT
      ) {
        return sum - amount;
      }

      return sum + amount;
    }, 0);

    const expectedBalance = Number(
      (Number(session.openingBalance) + movementDelta).toFixed(2),
    );
    const variance = Number((closingBalance - expectedBalance).toFixed(2));

    session.closingBalance = closingBalance;
    session.expectedBalance = expectedBalance;
    session.variance = variance;
    session.status = CashSessionStatus.CLOSED;
    session.closedAt = new Date();
    session.lastModifiedDate = new Date();

    const saved = await this.cashSessionRepo.save(session);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.OK,
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
