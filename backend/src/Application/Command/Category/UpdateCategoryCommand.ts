import { UpdateCategoryDTO } from '../../../Models/DTO/Category/CategoryApi';

export class UpdateCategoryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly id: number,
    public readonly category: UpdateCategoryDTO,
  ) {}
}
