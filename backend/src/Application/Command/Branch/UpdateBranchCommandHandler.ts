import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBranchCommand } from '../../../Application/Command/Branch/UpdateBranchCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Repository } from 'typeorm';

@CommandHandler(UpdateBranchCommand)
export class UpdateBranchCommandHandler {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async execute(command: UpdateBranchCommand): Promise<CommandResult<number>> {
    const { Id, branch } = command;
    const existing = await this.branchRepo.findOne({
      where: { id: Id },
    });

    if (!existing) {
      return {
        response: 0,
        statusCode: 404,
        isSuccess: false,
      };
    }

    Object.assign(existing, {
      ...branch,
      // updatedById: updatedByUserId,
      dateUpdated: new Date(),
    });

    const saved = await this.branchRepo.save(existing);
    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
