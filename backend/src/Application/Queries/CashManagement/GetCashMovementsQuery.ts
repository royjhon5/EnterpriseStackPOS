import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetCashMovementsQuery {
  constructor(
    public readonly tenantId: number,
    public readonly sessionId: number,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
