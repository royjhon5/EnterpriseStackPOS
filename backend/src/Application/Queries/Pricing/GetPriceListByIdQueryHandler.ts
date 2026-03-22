import { HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { PriceList } from '../../../Domain/Entities/Pricing/PricingList';
import { GetPriceListDTO } from '../../../Models/DTO/Pricing/PricingApi';
import { QueryResult } from '../../QueryResult';
import { GetPriceListByIdQuery } from './GetPriceListByIdQuery';

@QueryHandler(GetPriceListByIdQuery)
export class GetPriceListByIdQueryHandler implements IQueryHandler<
  GetPriceListByIdQuery,
  QueryResult<GetPriceListDTO>
> {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
  ) {}

  async execute(
    query: GetPriceListByIdQuery,
  ): Promise<QueryResult<GetPriceListDTO>> {
    const result = new QueryResult<GetPriceListDTO>();

    const priceList = await this.priceListRepo
      .createQueryBuilder('priceList')
      .leftJoinAndSelect('priceList.branch', 'branch')
      .leftJoinAndSelect('priceList.items', 'item')
      .leftJoinAndSelect('item.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('priceList.id = :id', { id: query.id })
      .andWhere('priceList.isDeleted = false')
      .andWhere('priceList.tenantId = :tenantId', { tenantId: query.tenantId })
      .getOne();

    if (!priceList) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Price list not found.';
      result.statusCode = HttpStatus.NOT_FOUND;
      result.validatorError = error;
      return result;
    }

    result.response = {
      id: priceList.id,
      tenantId: priceList.tenantId,
      branchId: priceList.branchId,
      branchName: priceList.branch?.branchName ?? null,
      effectiveFrom: priceList.effectiveFrom,
      effectiveTo: priceList.effectiveTo ?? null,
      items:
        priceList.items?.map((item) => ({
          id: item.id,
          priceListId: item.priceListId,
          variantId: item.variantId,
          productId: item.variant?.product?.id ?? 0,
          productName: item.variant?.product?.productName ?? '',
          barcode: item.variant?.barcode ?? '',
          unit: item.variant?.unit ?? '',
          sellingPrice: Number(item.sellingPrice),
        })) ?? [],
    };
    result.statusCode = HttpStatus.OK;
    return result;
  }
}
