import { GenerateDailySalesSummariesDTO } from '../../../Models/DTO/Summary/DailySalesApi';

export class GenerateDailySalesSummariesCommand {
  constructor(
    public readonly tenantId: number,
    public readonly summary: GenerateDailySalesSummariesDTO,
  ) {}
}
