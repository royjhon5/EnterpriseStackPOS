import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetTaxesQuery {
  constructor(
    public readonly tenantId: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
