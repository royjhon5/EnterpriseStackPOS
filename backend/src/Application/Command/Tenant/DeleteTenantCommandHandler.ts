// application/commands/soft-delete-tenant.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../../Domain/Entities/Tenant/Tenant';
import { CommandResult } from '../../../Application/CommandResult';
import { DeleteTenantCommand } from '../../../Application/Command/Tenant/DeleteTenantCommand';

@CommandHandler(DeleteTenantCommand)
export class SoftDeleteTenantCommandHandler implements ICommandHandler<DeleteTenantCommand> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async execute(command: DeleteTenantCommand): Promise<CommandResult<number>> {
    const { Id } = command;

    const tenant = await this.tenantRepo.findOne({
      where: { id: Id, isDeleted: false },
    });

    if (!tenant) {
      return {
        response: 0,
        statusCode: 404,
        isSuccess: false,
      };
    }

    tenant.isDeleted = true;
    tenant.isActive = false;
    tenant.lastModifiedDate = new Date();

    await this.tenantRepo.save(tenant);

    return {
      response: tenant.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
