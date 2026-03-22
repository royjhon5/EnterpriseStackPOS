import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryResult } from '../../QueryResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Product } from '../../../Domain/Entities/Product/Product';
import { GetProductDTO } from '../../../Models/DTO/Product/ProductApi';
import { GetProductByIdQuery } from './GetProductByIdQuery';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdQueryHandler implements IQueryHandler<
  GetProductByIdQuery,
  QueryResult<GetProductDTO>
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute(
    query: GetProductByIdQuery,
  ): Promise<QueryResult<GetProductDTO>> {
    const result = new QueryResult<GetProductDTO>();

    const product = await this.productRepo.findOne({
      where: {
        id: query.id,
        tenantId: query.tenantId,
        isDeleted: false,
      },
      relations: ['category'],
    });

    if (!product) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Product not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: product.id,
      tenantId: product.tenantId,
      categoryId: product.categoryId,
      categoryName: product.category?.categoryName ?? '',
      sku: product.sku,
      productName: product.productName,
      description: product.description,
      isActive: product.isActive,
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
