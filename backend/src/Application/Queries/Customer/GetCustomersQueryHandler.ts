import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../../Domain/Entities/Customer/Customer';
import { GetCustomerDTO } from '../../../Models/DTO/Customer/Customer';
import { QueryPageResult } from '../../QueryPageResult';
import { GetCustomersQuery } from './GetCustomersQuery';

@QueryHandler(GetCustomersQuery)
export class GetCustomersQueryHandler implements IQueryHandler<
  GetCustomersQuery,
  QueryPageResult<GetCustomerDTO[]>
> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async execute(
    query: GetCustomersQuery,
  ): Promise<QueryPageResult<GetCustomerDTO[]>> {
    const result = new QueryPageResult<GetCustomerDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.customerRepo
      .createQueryBuilder('customer')
      .where('customer.isDeleted = false')
      .andWhere('customer.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : `(
              customer.fullName LIKE :searchKey
              OR customer.contactNo LIKE :searchKey
              OR customer.email LIKE :searchKey
            )`,
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('customer.fullName', 'ASC');

    const [customers, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = customers.map((customer) => ({
      id: customer.id,
      tenantId: customer.tenantId,
      fullName: customer.fullName,
      contactNo: customer.contactNo,
      email: customer.email,
      loyaltyPoints: customer.loyaltyPoints,
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
