import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { CashMovement } from '../../../Domain/Entities/CashManagement/CashMovement';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';
import { GetCashMovementDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';
import { GetCashMovementsQuery } from './GetCashMovementsQuery';

@QueryHandler(GetCashMovementsQuery)
export class GetCashMovementsQueryHandler implements IQueryHandler<
  GetCashMovementsQuery,
  QueryPageResult<GetCashMovementDTO[]>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
    @InjectRepository(CashMovement)
    private readonly cashMovementRepo: Repository<CashMovement>,
  ) {}

  async execute(
    query: GetCashMovementsQuery,
  ): Promise<QueryPageResult<GetCashMovementDTO[]>> {
    const result = new QueryPageResult<GetCashMovementDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const session = await this.cashSessionRepo.findOne({
      where: {
        id: query.sessionId,
        tenantId: query.tenantId,
        isDeleted: false,
      },
    });

    if (!session) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Cash session not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    const [movements, totalCount] = await this.cashMovementRepo.findAndCount({
      where: {
        sessionId: query.sessionId,
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    result.response = movements.map((movement) => ({
      id: movement.id,
      sessionId: movement.sessionId,
      movementType: movement.movementType,
      amount: Number(movement.amount),
      referenceNo: movement.referenceNo,
      createdAt: movement.createdAt,
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
