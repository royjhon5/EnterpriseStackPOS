import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBranchCommand } from '../../../Application/Command/Branch/CreateBranchCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Branch } from '../../../Domain/Entities/Branch/Branch';
import { Repository } from 'typeorm';

@CommandHandler(CreateBranchCommand)
export class CreateBranchCommandHandler {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(command: CreateBranchCommand): Promise<CommandResult<number>> {
    const { branch } = command;

    const newBranch = this.branchRepository.create({
      tenant: { id: branch.TenantID },
      branchName: branch.branchName,
      address: branch.address,
      contactNo: branch.contactNo,
      isActive: branch.isActive,
    });

    const saved = await this.branchRepository.save(newBranch);

    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
