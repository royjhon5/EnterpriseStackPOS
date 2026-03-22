import { ExtendedParameters } from '@/Models/ExtendedParameters';

export class GetAllPermissionsQuery {
  constructor(
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
