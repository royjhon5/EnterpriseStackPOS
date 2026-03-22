import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCommand } from './CreateProductCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Category } from '../../../Domain/Entities/Category/Category';
import { Product } from '../../../Domain/Entities/Product/Product';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<
  CreateProductCommand,
  CommandResult<number>
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async execute(command: CreateProductCommand): Promise<CommandResult<number>> {
    const sku = command.product.sku?.trim();
    const productName = command.product.productName?.trim();

    if (!sku || !productName) {
      const error = new ValidationError(HttpStatus.BAD_REQUEST);
      error.message = 'SKU and product name are required.';
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
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

    const existing = await this.productRepo.findOne({
      where: {
        tenantId: command.tenantId,
        sku,
        isDeleted: false,
      },
    });

    if (existing) {
      const error = new ValidationError(HttpStatus.CONFLICT);
      error.message = 'SKU already exists for this tenant.';
      return new CommandResult<number>({
        statusCode: HttpStatus.CONFLICT,
        validatorError: error,
      });
    }

    const product = this.productRepo.create({
      tenantId: command.tenantId,
      categoryId: command.product.categoryId,
      sku,
      productName,
      description: command.product.description?.trim() || undefined,
      isActive: command.product.isActive,
    });

    const saved = await this.productRepo.save(product);

    return new CommandResult<number>({
      response: saved.id,
      statusCode: HttpStatus.CREATED,
    });
  }
}
