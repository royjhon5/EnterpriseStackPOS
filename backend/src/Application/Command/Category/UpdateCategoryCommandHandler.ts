import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryCommand } from './UpdateCategoryCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler implements ICommandHandler<
  UpdateCategoryCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(
    command: UpdateCategoryCommand,
  ): Promise<CommandResult<number>> {
    const categoryName = command.category.categoryName?.trim();

    if (!categoryName) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Category name is required.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

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
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    category.categoryName = categoryName;
    category.lastModifiedDate = new Date();

    const saved = await this.categoryRepo.save(category);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.OK,
    });
  }
}
