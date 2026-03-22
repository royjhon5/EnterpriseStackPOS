import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { POSDevice } from '../../../Domain/Entities/POS/POSDevice';
import { GetPOSDeviceDTO } from '../../../Models/DTO/POS/POSApi';
import { QueryResult } from '../../QueryResult';
import { GetPOSDeviceByIdQuery } from './GetPOSDeviceByIdQuery';

@QueryHandler(GetPOSDeviceByIdQuery)
export class GetPOSDeviceByIdQueryHandler implements IQueryHandler<
  GetPOSDeviceByIdQuery,
  QueryResult<GetPOSDeviceDTO>
> {
  constructor(
    @InjectRepository(POSDevice)
    private readonly deviceRepo: Repository<POSDevice>,
  ) {}

  async execute(
    query: GetPOSDeviceByIdQuery,
  ): Promise<QueryResult<GetPOSDeviceDTO>> {
    const result = new QueryResult<GetPOSDeviceDTO>();
    const device = await this.deviceRepo
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('device.id = :id', { id: query.id })
      .andWhere('device.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!device) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'POS device not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: device.id,
      branchId: device.branchId,
      branchName: device.branch?.branchName ?? '',
      deviceCode: device.deviceCode,
      isActive: device.isActive,
      lastSyncAt: device.lastSyncAt ?? null,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
