import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetSalesReturnsQuery {
  constructor(
    public readonly tenantId: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
