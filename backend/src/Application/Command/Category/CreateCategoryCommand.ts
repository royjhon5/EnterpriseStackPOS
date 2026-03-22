import { CreateCategoryDTO } from '../../../Models/DTO/Category/CategoryApi';

export class CreateCategoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly category: CreateCategoryDTO,
  ) {}
}
