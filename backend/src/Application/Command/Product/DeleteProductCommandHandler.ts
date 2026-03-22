import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteProductCommand } from './DeleteProductCommand';
import { CommandResult } from '../../CommandResult';
import { ValidationError } from '../../../Constants/ValidationError';
import { Product } from '../../../Domain/Entities/Product/Product';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler implements ICommandHandler<
  DeleteProductCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async execute(
    command: DeleteProductCommand,
  ): Promise<CommandResult<boolean>> {
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
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    product.isDeleted = true;
    product.lastModifiedDate = new Date();
    await this.productRepo.save(product);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
