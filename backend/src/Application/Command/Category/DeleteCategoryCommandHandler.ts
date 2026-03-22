import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteCategoryCommand } from './DeleteCategoryCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler implements ICommandHandler<
  DeleteCategoryCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(
    command: DeleteCategoryCommand,
  ): Promise<CommandResult<boolean>> {
    const category = await this.categoryRepo.findOne({
      where: {
        id: command.id,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!category) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Category not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    category.isDeleted = true;
    category.lastModifiedDate = new Date();
    await this.categoryRepo.save(category);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
