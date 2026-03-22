import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetAllBranchQuery {
  constructor(
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
