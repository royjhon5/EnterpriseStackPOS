import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { Product } from '../../../Domain/Entities/Product/Product';
import { GetProductDTO } from '../../../Models/DTO/Product/ProductApi';
import { GetProductsQuery } from './GetProductsQuery';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler implements IQueryHandler<
  GetProductsQuery,
  QueryPageResult<GetProductDTO[]>
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute(
    query: GetProductsQuery,
  ): Promise<QueryPageResult<GetProductDTO[]>> {
    const result = new QueryPageResult<GetProductDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .where('p.isDeleted = false')
      .andWhere('p.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(
        !query.searchKey
          ? '1=1'
          : '(p.productName LIKE :searchKey OR p.sku LIKE :searchKey OR c.categoryName LIKE :searchKey)',
        { searchKey: `%${query.searchKey}%` },
      )
      .orderBy('p.productName', 'ASC');

    const [products, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = products.map((product) => ({
      id: product.id,
      tenantId: product.tenantId,
      categoryId: product.categoryId,
      categoryName: product.category?.categoryName ?? '',
      sku: product.sku,
      productName: product.productName,
      description: product.description,
      isActive: product.isActive,
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
