import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { POSDevice } from '../../../Domain/Entities/POS/POSDevice';
import { CommandResult } from '../../CommandResult';
import { DeletePOSDeviceCommand } from './DeletePOSDeviceCommand';

@CommandHandler(DeletePOSDeviceCommand)
export class DeletePOSDeviceCommandHandler implements ICommandHandler<
  DeletePOSDeviceCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(POSDevice)
    private readonly deviceRepo: Repository<POSDevice>,
  ) {}

  async execute(
    command: DeletePOSDeviceCommand,
  ): Promise<CommandResult<boolean>> {
    const device = await this.deviceRepo
      .createQueryBuilder('device')
      .leftJoin('device.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('device.id = :id', { id: command.id })
      .andWhere('device.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: command.tenantId })
      .getOne();

    if (!device) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'POS device not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    device.isDeleted = true;
    device.lastModifiedDate = new Date();
    await this.deviceRepo.save(device);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
