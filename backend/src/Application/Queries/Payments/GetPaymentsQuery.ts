import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetPaymentsQuery {
  constructor(
    public readonly tenantId: number,
    public readonly saleId: number,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
