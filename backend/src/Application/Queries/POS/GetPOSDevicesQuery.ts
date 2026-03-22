import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetPOSDevicesQuery {
  constructor(
    public readonly tenantId: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
