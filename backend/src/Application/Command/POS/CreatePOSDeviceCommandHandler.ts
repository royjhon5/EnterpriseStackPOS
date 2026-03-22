import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { POSDevice } from '../../../Domain/Entities/POS/POSDevice';
import { CommandResult } from '../../CommandResult';
import { CreatePOSDeviceCommand } from './CreatePOSDeviceCommand';

@CommandHandler(CreatePOSDeviceCommand)
export class CreatePOSDeviceCommandHandler implements ICommandHandler<
  CreatePOSDeviceCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(POSDevice)
    private readonly deviceRepo: Repository<POSDevice>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async execute(
    command: CreatePOSDeviceCommand,
  ): Promise<CommandResult<number>> {
    const deviceCode = command.device.deviceCode?.trim();
    if (!deviceCode) {
      return this.error('Device code is required.');
    }

    const branch = await this.branchRepo
      .createQueryBuilder('branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('branch.id = :branchId', { branchId: command.device.branchId })
      .andWhere('branch.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!branch) {
      return this.error('Branch does not exist for this tenant.');
    }

    const existing = await this.deviceRepo.findOne({
      where: {
        branchId: command.device.branchId,
        deviceCode,
        isDeleted: false,
      },
    });

    if (existing) {
      return this.error(
        'Device code already exists for this branch.',
        HttpStatus.CONFLICT,
      );
    }

    const device = this.deviceRepo.create({
      branchId: command.device.branchId,
      deviceCode,
      isActive: command.device.isActive ?? true,
    });
    await this.deviceRepo.save(device);

    return new CommandResult<number>({
      response: device.id,
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
