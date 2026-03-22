import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { Tax } from '../../../Domain/Entities/Tax/Tax';
import { GetTaxDTO } from '../../../Models/DTO/Tax/TaxApi';
import { GetTaxesQuery } from './GetTaxesQuery';

@QueryHandler(GetTaxesQuery)
export class GetTaxesQueryHandler implements IQueryHandler<
  GetTaxesQuery,
  QueryPageResult<GetTaxDTO[]>
> {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async execute(query: GetTaxesQuery): Promise<QueryPageResult<GetTaxDTO[]>> {
    const result = new QueryPageResult<GetTaxDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.taxRepo
      .createQueryBuilder('tax')
      .where('tax.isDeleted = false')
      .andWhere('tax.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(!query.searchKey ? '1=1' : 'tax.taxName LIKE :searchKey', {
        searchKey: `%${query.searchKey}%`,
      })
      .orderBy('tax.taxName', 'ASC');

    const [taxes, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = taxes.map((tax) => ({
      id: tax.id,
      tenantId: tax.tenantId,
      taxName: tax.taxName,
      rate: Number(tax.rate),
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
