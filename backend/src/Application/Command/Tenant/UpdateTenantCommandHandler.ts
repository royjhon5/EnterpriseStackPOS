// application/commands/update-tenant.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTenantCommand } from '../../../Application/Command/Tenant/UpdateTenantCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantCommandHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async execute(command: UpdateTenantCommand): Promise<CommandResult<number>> {
    const { tenantId, tenant } = command;

    const existing = await this.tenantRepo.findOne({
      where: { id: tenantId },
    });

    if (!existing) {
      return {
        response: 0,
        statusCode: 404,
        isSuccess: false,
      };
    }

    Object.assign(existing, {
      ...tenant,
      // updatedById: updatedByUserId,
      dateUpdated: new Date(),
    });

    const saved = await this.tenantRepo.save(existing);

    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
