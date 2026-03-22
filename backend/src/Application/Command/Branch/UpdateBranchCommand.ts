import { UpdateBranchDTO } from '../../../Models/DTO/Branch/Branch';

export class UpdateBranchCommand {
  constructor(
    public readonly Id: number,
    public readonly branch: UpdateBranchDTO,
    // public readonly updatedByUserId: string,
  ) {}
}
