import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryResult } from '../../QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Tax } from '../../../Domain/Entities/Tax/Tax';
import { GetTaxDTO } from '../../../Models/DTO/Tax/TaxApi';
import { GetTaxByIdQuery } from './GetTaxByIdQuery';

@QueryHandler(GetTaxByIdQuery)
export class GetTaxByIdQueryHandler implements IQueryHandler<
  GetTaxByIdQuery,
  QueryResult<GetTaxDTO>
> {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async execute(query: GetTaxByIdQuery): Promise<QueryResult<GetTaxDTO>> {
    const result = new QueryResult<GetTaxDTO>();

    const tax = await this.taxRepo.findOne({
      where: {
        id: query.id,
        tenantId: query.tenantId,
        isDeleted: false,
      },
    });

    if (!tax) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Tax not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: tax.id,
      tenantId: tax.tenantId,
      taxName: tax.taxName,
      rate: Number(tax.rate),
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
