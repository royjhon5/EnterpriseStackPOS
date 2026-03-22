import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POSDevice } from '../../../Domain/Entities/POS/POSDevice';
import { GetPOSDeviceDTO } from '../../../Models/DTO/POS/POSApi';
import { QueryPageResult } from '../../QueryPageResult';
import { GetPOSDevicesQuery } from './GetPOSDevicesQuery';

@QueryHandler(GetPOSDevicesQuery)
export class GetPOSDevicesQueryHandler implements IQueryHandler<
  GetPOSDevicesQuery,
  QueryPageResult<GetPOSDeviceDTO[]>
> {
  constructor(
    @InjectRepository(POSDevice)
    private readonly deviceRepo: Repository<POSDevice>,
  ) {}

  async execute(
    query: GetPOSDevicesQuery,
  ): Promise<QueryPageResult<GetPOSDeviceDTO[]>> {
    const result = new QueryPageResult<GetPOSDeviceDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.deviceRepo
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .where('device.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(branch.branchName LIKE :searchKey OR device.deviceCode LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('device.deviceCode', 'ASC');

    const [devices, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = devices.map((device) => ({
      id: device.id,
      branchId: device.branchId,
      branchName: device.branch?.branchName ?? '',
      deviceCode: device.deviceCode,
      isActive: device.isActive,
      lastSyncAt: device.lastSyncAt ?? null,
    }));
    result.statusCode = HttpStatus.OK;
    result.pageDetails = {
      totalCount,
      pageSize,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
      hasPrevious: currentPage > 1,
      hasNext: currentPage * pageSize < totalCount,
    };

    return result;
  }
}
