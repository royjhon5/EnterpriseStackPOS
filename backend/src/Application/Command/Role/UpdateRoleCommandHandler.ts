import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoleCommand } from '../../../Application/Command/Role/UpdateRoleCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Role } from '../../../Domain/Entities/Role/Role';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleCommandHandler {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<CommandResult<number>> {
    const { id, updateRoleDto } = command;
    const existing = await this.roleRepo.findOne({
      where: { id: id },
    });

    if (!existing) {
      return {
        response: 0,
        statusCode: 404,
        isSuccess: false,
      };
    }

    Object.assign(existing, {
      ...updateRoleDto,
      // updatedById: updatedByUserId,
      dateUpdated: new Date(),
    });

    const saved = await this.roleRepo.save(existing);

    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
