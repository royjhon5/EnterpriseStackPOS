import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBranchCommand } from '../../../Application/Command/Branch/DeleteBranchCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Repository } from 'typeorm';

@CommandHandler(DeleteBranchCommand)
export class DeleteBranchCommandHandler {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}
  async execute(command: DeleteBranchCommand): Promise<CommandResult<number>> {
    const { Id } = command;

    const branch = await this.branchRepo.findOne({
      where: { id: Id, isDeleted: false },
    });

    if (!branch) {
      return {
        response: 0,
        statusCode: 404,
        isSuccess: false,
      };
    }

    branch.isDeleted = true;
    branch.isActive = false;
    branch.lastModifiedDate = new Date();

    await this.branchRepo.save(branch);

    return {
      response: branch.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
