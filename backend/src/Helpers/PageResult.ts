import { ExtendedPageDetails } from '../Models/ExtendedPageDetails';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class PageResult<T> {
  extendedPageDetails: ExtendedPageDetails;
  dataResult: T[];

  constructor(items: T[], count: number, pageNumber: number, pageSize: number) {
    const totalPages = Math.ceil(count / pageSize);

    this.extendedPageDetails = {
      totalCount: count,
      pageSize,
      currentPage: pageNumber,
      totalPages,
      hasPrevious: pageNumber > 1,
      hasNext: pageNumber < totalPages,
    };

    this.dataResult = items;
  }

  static async toPagedListAsync<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    pageNumber: number,
    pageSize: number,
  ): Promise<PageResult<T>> {
    const [items, count] = await query
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return new PageResult<T>(items, count, pageNumber, pageSize);
  }

  static enumerableToPagedListAsync<T>(
    source: T[],
    pageNumber: number,
    pageSize: number,
  ): Promise<PageResult<T>> {
    const count = source.length;
    const items = source.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    );

    return Promise.resolve(
      new PageResult<T>(items, count, pageNumber, pageSize),
    );
  }
}
