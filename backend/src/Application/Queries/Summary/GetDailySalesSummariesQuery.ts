import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetDailySalesSummariesQuery {
  constructor(
    public readonly tenantId: number,
    public readonly dateFrom: string | undefined,
    public readonly dateTo: string | undefined,
    public readonly branchId: number | undefined,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
