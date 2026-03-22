import { ExtendedParameters } from '../../../Models/ExtendedParameters';

// Application/Query/Tenant/GetAllTenantsQuery.ts
export class GetUserDetailsQuery {
  constructor(
    public readonly Id: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
