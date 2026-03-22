import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { GetCustomerDTO } from '../../../Models/DTO/Customer/Customer';
import { QueryResult } from '../../QueryResult';
import { GetCustomerByIdQuery } from './GetCustomerByIdQuery';

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdQueryHandler implements IQueryHandler<
  GetCustomerByIdQuery,
  QueryResult<GetCustomerDTO>
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async execute(
    query: GetCustomerByIdQuery,
  ): Promise<QueryResult<GetCustomerDTO>> {
    const result = new QueryResult<GetCustomerDTO>();

    const customer = await this.customerRepo.findOne({
      where: {
        id: query.id,
        tenantId: query.tenantId,
        isDeleted: false,
      },
    });

    if (!customer) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Customer not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: customer.id,
      tenantId: customer.tenantId,
      fullName: customer.fullName,
      contactNo: customer.contactNo,
      email: customer.email,
      loyaltyPoints: customer.loyaltyPoints,
    };
    result.statusCode = HttpStatus.OK;

    return result;
  }
}
