import { ExtendedParameters } from '../../../Models/ExtendedParameters';

export class GetBranchDetailByIdQuery {
  constructor(
    public readonly Id: number,
    public readonly searchKey: string,
    public readonly extendedParameters: ExtendedParameters,
  ) {}
}
