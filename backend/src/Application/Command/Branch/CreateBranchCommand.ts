import { CreateBranchDTO } from '../../../Models/DTO/Branch/Branch';

export class CreateBranchCommand {
  constructor(
    // public readonly createdByUserId: string,
    public readonly branch: CreateBranchDTO,
  ) {}
}
