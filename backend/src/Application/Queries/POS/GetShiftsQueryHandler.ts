import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../../../Domain/Entities/POS/Shift';
import { GetShiftDTO } from '../../../Models/DTO/POS/POSApi';
import { QueryPageResult } from '../../QueryPageResult';
import { GetShiftsQuery } from './GetShiftsQuery';

@QueryHandler(GetShiftsQuery)
export class GetShiftsQueryHandler implements IQueryHandler<
  GetShiftsQuery,
  QueryPageResult<GetShiftDTO[]>
> {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
  ) {}

  async execute(
    query: GetShiftsQuery,
  ): Promise<QueryPageResult<GetShiftDTO[]>> {
    const result = new QueryPageResult<GetShiftDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.shiftRepo
      .createQueryBuilder('shift')
      .leftJoinAndSelect('shift.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .leftJoinAndSelect('shift.user', 'user')
      .where('shift.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(branch.branchName LIKE :searchKey OR user.fullName LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('shift.startTime', 'DESC');

    const [shifts, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = shifts.map((shift) => ({
      id: shift.id,
      branchId: shift.branchId,
      branchName: shift.branch?.branchName ?? '',
      userId: shift.userId,
      userName: shift.user?.fullName ?? '',
      startTime: shift.startTime,
      endTime: shift.endTime ?? null,
      isOpen: !shift.endTime,
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
