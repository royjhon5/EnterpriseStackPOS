import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { POSDevice } from '../../../Domain/Entities/POS/POSDevice';
import { CommandResult } from '../../CommandResult';
import { UpdatePOSDeviceCommand } from './UpdatePOSDeviceCommand';

@CommandHandler(UpdatePOSDeviceCommand)
export class UpdatePOSDeviceCommandHandler implements ICommandHandler<
  UpdatePOSDeviceCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(POSDevice)
    private readonly deviceRepo: Repository<POSDevice>,
  ) {}

  async execute(
    command: UpdatePOSDeviceCommand,
  ): Promise<CommandResult<number>> {
    const deviceCode = command.device.deviceCode?.trim();
    if (!deviceCode) {
      return this.error('Device code is required.');
    }

    const device = await this.deviceRepo
      .createQueryBuilder('device')
      .leftJoin('device.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('device.id = :id', { id: command.id })
      .andWhere('device.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!device) {
      return this.error('POS device not found.', HttpStatus.NOT_FOUND);
    }

    const duplicate = await this.deviceRepo.findOne({
      where: {
        id: Not(command.id),
        branchId: device.branchId,
        deviceCode,
        isDeleted: false,
      },
    });

    if (duplicate) {
      return this.error(
        'Device code already exists for this branch.',
        HttpStatus.CONFLICT,
      );
    }

    device.deviceCode = deviceCode;
    device.isActive = command.device.isActive;
    device.lastSyncAt = command.device.lastSyncAt ?? null;
    device.lastModifiedDate = new Date();
    await this.deviceRepo.save(device);

    return new CommandResult<number>({
      response: device.id,
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
