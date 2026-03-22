import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryResult } from '../../QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { CashMovement } from '../../../Domain/Entities/CashManagement/CashMovement';
import { CashSession } from '../../../Domain/Entities/CashManagement/CashManagement';
import { GetCashMovementDTO } from '../../../Models/DTO/CashManagement/CashManagementApi';
import { GetCashMovementByIdQuery } from './GetCashMovementByIdQuery';

@QueryHandler(GetCashMovementByIdQuery)
export class GetCashMovementByIdQueryHandler implements IQueryHandler<
  GetCashMovementByIdQuery,
  QueryResult<GetCashMovementDTO>
> {
  constructor(
    @InjectRepository(CashSession)
    private readonly cashSessionRepo: Repository<CashSession>,
    @InjectRepository(CashMovement)
    private readonly cashMovementRepo: Repository<CashMovement>,
  ) {}

  async execute(
    query: GetCashMovementByIdQuery,
  ): Promise<QueryResult<GetCashMovementDTO>> {
    const result = new QueryResult<GetCashMovementDTO>();

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

    const movement = await this.cashMovementRepo.findOne({
      where: {
        id: query.id,
        sessionId: query.sessionId,
        isDeleted: false,
      },
    });

    if (!movement) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Cash movement not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: movement.id,
      sessionId: movement.sessionId,
      movementType: movement.movementType,
      amount: Number(movement.amount),
      referenceNo: movement.referenceNo,
      createdAt: movement.createdAt,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
