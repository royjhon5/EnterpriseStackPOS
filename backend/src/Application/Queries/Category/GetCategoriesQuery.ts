import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetCategoriesQuery {
  constructor(
    public readonly tenantId: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
