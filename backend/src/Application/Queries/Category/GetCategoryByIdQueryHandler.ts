import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryResult } from '../../QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';
import { GetCategoryDTO } from '../../../Models/DTO/Category/CategoryApi';
import { GetCategoryByIdQuery } from './GetCategoryByIdQuery';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdQueryHandler implements IQueryHandler<
  GetCategoryByIdQuery,
  QueryResult<GetCategoryDTO>
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(
    query: GetCategoryByIdQuery,
  ): Promise<QueryResult<GetCategoryDTO>> {
    const result = new QueryResult<GetCategoryDTO>();

    const category = await this.categoryRepo.findOne({
      where: {
        id: query.id,
        tenantId: query.tenantId,
        isDeleted: false,
      },
    });

    if (!category) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Category not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: category.id,
      tenantId: category.tenantId,
      categoryName: category.categoryName,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
