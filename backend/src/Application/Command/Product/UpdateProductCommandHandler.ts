import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductCommand } from './UpdateProductCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';
import { Product } from '../../../Domain/Entities/Product/Product';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<
  UpdateProductCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<CommandResult<number>> {
    const product = await this.productRepo.findOne({
      where: {
        id: command.id,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!product) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Product not found.';
      return new CommandResult<number>({
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    const category = await this.categoryRepo.findOne({
      where: {
        id: command.product.categoryId,
        tenantId: command.tenantId,
        isDeleted: false,
      },
    });

    if (!category) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'Category does not exist for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: error,
      });
    }

    product.categoryId = command.product.categoryId;
    product.sku = command.product.sku.trim();
    product.productName = command.product.productName.trim();
    product.description = command.product.description?.trim() || undefined;
    product.isActive = command.product.isActive;
    product.lastModifiedDate = new Date();

    const saved = await this.productRepo.save(product);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.OK,
    });
  }
}
