import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Shift } from '../../../Domain/Entities/POS/Shift';
import { User } from '../../../Domain/Entities/User/User';
import { CommandResult } from '../../CommandResult';
import { OpenShiftCommand } from './OpenShiftCommand';

@CommandHandler(OpenShiftCommand)
export class OpenShiftCommandHandler implements ICommandHandler<
  OpenShiftCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(command: OpenShiftCommand): Promise<CommandResult<number>> {
    const branch = await this.branchRepo
      .createQueryBuilder('branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('branch.id = :branchId', { branchId: command.shift.branchId })
      .andWhere('branch.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!branch) {
      return this.error('Branch does not exist for this tenant.');
    }

    const user = await this.userRepo.findOne({
      where: {
        id: command.shift.userId,
        tenantId: command.tenantId,
        isActive: true,
      },
    });

    if (!user) {
      return this.error('User does not exist for this tenant.');
    }

    const existing = await this.shiftRepo.findOne({
      where: {
        branchId: command.shift.branchId,
        userId: command.shift.userId,
        endTime: IsNull(),
        isDeleted: false,
      },
    });

    if (existing) {
      return this.error(
        'An open shift already exists for this user and branch.',
        HttpStatus.CONFLICT,
      );
    }

    const shift = this.shiftRepo.create({
      branchId: command.shift.branchId,
      userId: command.shift.userId,
      startTime: command.shift.startTime ?? new Date(),
    });
    await this.shiftRepo.save(shift);

    return new CommandResult<number>({
      response: shift.id,
      statusCode: HttpStatus.CREATED,
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
