import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Shift } from '../../../Domain/Entities/POS/Shift';
import { CommandResult } from '../../CommandResult';
import { CloseShiftCommand } from './CloseShiftCommand';

@CommandHandler(CloseShiftCommand)
export class CloseShiftCommandHandler implements ICommandHandler<
  CloseShiftCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
  ) {}

  async execute(command: CloseShiftCommand): Promise<CommandResult<number>> {
    const shift = await this.shiftRepo
      .createQueryBuilder('shift')
      .leftJoin('shift.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('shift.id = :id', { id: command.id })
      .andWhere('shift.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!shift) {
      return this.error('Shift not found.', HttpStatus.NOT_FOUND);
    }

    if (shift.endTime) {
      return this.error('Shift is already closed.', HttpStatus.CONFLICT);
    }

    const endTime = command.shift.endTime ?? new Date();
    if (new Date(endTime) < new Date(shift.startTime)) {
      return this.error('End time must be on or after the shift start time.');
    }

    shift.endTime = endTime;
    shift.lastModifiedDate = new Date();
    await this.shiftRepo.save(shift);

    return new CommandResult<number>({
      response: shift.id,
      statusCode: HttpStatus.OK,
    });
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
