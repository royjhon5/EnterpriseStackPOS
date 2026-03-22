import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryPageResult } from '../../QueryPageResult';
import { Category } from '../../../Domain/Entities/Category/Category';
import { GetCategoryDTO } from '../../../Models/DTO/Category/CategoryApi';
import { GetCategoriesQuery } from './GetCategoriesQuery';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler implements IQueryHandler<
  GetCategoriesQuery,
  QueryPageResult<GetCategoryDTO[]>
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(
    query: GetCategoriesQuery,
  ): Promise<QueryPageResult<GetCategoryDTO[]>> {
    const result = new QueryPageResult<GetCategoryDTO[]>();
    const currentPage = query.extendedParameters.pageNumber;
    const pageSize = query.extendedParameters.pageSize;

    const qb = this.categoryRepo
      .createQueryBuilder('c')
      .where('c.isDeleted = false')
      .andWhere('c.tenantId = :tenantId', { tenantId: query.tenantId })
      .andWhere(!query.searchKey ? '1=1' : 'c.categoryName LIKE :searchKey', {
        searchKey: `%${query.searchKey}%`,
      })
      .orderBy('c.categoryName', 'ASC');

    const [categories, totalCount] = await qb
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    result.response = categories.map((category) => ({
      id: category.id,
      tenantId: category.tenantId,
      categoryName: category.categoryName,
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
