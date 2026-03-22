import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError } from '../../../Constants/ValidationError';
import { PriceList } from '../../../Domain/Entities/Pricing/PricingList';
import { CommandResult } from '../../CommandResult';
import { DeletePriceListCommand } from './DeletePriceListCommand';

@CommandHandler(DeletePriceListCommand)
export class DeletePriceListCommandHandler implements ICommandHandler<
  DeletePriceListCommand,
  CommandResult<boolean>
> {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
  ) {}

  async execute(
    command: DeletePriceListCommand,
  ): Promise<CommandResult<boolean>> {
    const priceList = await this.priceListRepo.findOne({
      where: { id: command.id, tenantId: command.tenantId, isDeleted: false },
    });

    if (!priceList) {
      const error = new ValidationError(HttpStatus.NOT_FOUND);
      error.message = 'Price list not found.';
      return new CommandResult<boolean>({
        response: false,
        statusCode: HttpStatus.NOT_FOUND,
        validatorError: error,
      });
    }

    priceList.isDeleted = true;
    priceList.lastModifiedDate = new Date();
    await this.priceListRepo.save(priceList);

    return new CommandResult<boolean>({
      response: true,
      statusCode: HttpStatus.OK,
    });
  }
}
