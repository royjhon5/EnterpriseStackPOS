import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { PriceList } from '../../../Domain/Entities/Pricing/PricingList';
import { GetPriceListDTO } from '../../../Models/DTO/Pricing/PricingApi';
import { GetPriceListsQuery } from './GetPriceListsQuery';

@QueryHandler(GetPriceListsQuery)
export class GetPriceListsQueryHandler implements IQueryHandler<
  GetPriceListsQuery,
  QueryPageResult<GetPriceListDTO[]>
> {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
  ) {}

  async execute(
    query: GetPriceListsQuery,
  ): Promise<QueryPageResult<GetPriceListDTO[]>> {
    const result = new QueryPageResult<GetPriceListDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.priceListRepo
      .createQueryBuilder('priceList')
      .leftJoinAndSelect('priceList.branch', 'branch')
      .where('priceList.isDeleted = false')
      .andWhere('priceList.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(branch.branchName LIKE :searchKey OR priceList.id LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('priceList.effectiveFrom', 'DESC')
      .addOrderBy('priceList.id', 'DESC');

    const [priceLists, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = priceLists.map((priceList) => ({
      id: priceList.id,
      tenantId: priceList.tenantId,
      branchId: priceList.branchId,
      branchName: priceList.branch?.branchName ?? null,
      effectiveFrom: priceList.effectiveFrom,
      effectiveTo: priceList.effectiveTo ?? null,
      items: [],
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
