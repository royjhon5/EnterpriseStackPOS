// application/commands/create-inventory-item.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTenantCommand } from '../../../Application/Command/Tenant/CreateTenantCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { Repository } from 'typeorm';

@CommandHandler(CreateTenantCommand)
export class CreateTenantCommandHandler implements ICommandHandler<CreateTenantCommand> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async execute(command: CreateTenantCommand): Promise<CommandResult<number>> {
    const { tenant } = command;

    const item = this.tenantRepo.create({
      tenantName: tenant.tenantName,
      name: tenant.name,
      code: tenant.code,
      subscriptionPlan: tenant.subscriptionPlan,
      isActive: tenant.isActive,
      createdById: command.createdByUserId,
      dateCreated: new Date(),
    });

    const saved = await this.tenantRepo.save(item);

    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
