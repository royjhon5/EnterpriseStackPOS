import { ExtendedParameters } from 'src/Models/ExtendedParameters';

export class GetUserQuery {
  constructor(
    public readonly tenantId: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
