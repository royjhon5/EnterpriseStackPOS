import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryCommand } from './CreateCategoryCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<
  CreateCategoryCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(
    command: CreateCategoryCommand,
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

    const existing = await this.categoryRepo.findOne({
      where: {
        tenantId: command.tenantId,
        categoryName,
        isDeleted: false,
      },
    });

    if (existing) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'Category already exists for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    const category = this.categoryRepo.create({
      tenantId: command.tenantId,
      categoryName,
    });

    const saved = await this.categoryRepo.save(category);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.CREATED,
    });
  }
}
