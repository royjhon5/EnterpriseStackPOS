import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryResult } from '../../QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Shift } from '../../../Domain/Entities/POS/Shift';
import { GetShiftDTO } from '../../../Models/DTO/POS/POSApi';
import { GetShiftByIdQuery } from './GetShiftByIdQuery';

@QueryHandler(GetShiftByIdQuery)
export class GetShiftByIdQueryHandler implements IQueryHandler<
  GetShiftByIdQuery,
  QueryResult<GetShiftDTO>
> {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
  ) {}

  async execute(query: GetShiftByIdQuery): Promise<QueryResult<GetShiftDTO>> {
    const result = new QueryResult<GetShiftDTO>();
    const shift = await this.shiftRepo
      .createQueryBuilder('shift')
      .leftJoinAndSelect('shift.branch', 'branch')
      .leftJoin('branch.tenant', 'tenant')
      .leftJoinAndSelect('shift.user', 'user')
      .where('shift.id = :id', { id: query.id })
      .andWhere('shift.isDeleted = false')
      .andWhere('tenant.id = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!shift) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Shift not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: shift.id,
      branchId: shift.branchId,
      branchName: shift.branch?.branchName ?? '',
      userId: shift.userId,
      userName: shift.user?.fullName ?? '',
      startTime: shift.startTime,
      endTime: shift.endTime ?? null,
      isOpen: !shift.endTime,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
