import { HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleCommand } from '../../../Application/Command/Role/CreateRoleCommand';
import { CommandResult } from '../../../Application/CommandResult';
import { Role } from '../../../Domain/Entities/Role/Role';
import { toValidationError } from '../../../Services/Validations/Props/ToValidationError';
import { Validator } from '../../../Services/Validations/Props/Validations';

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(command: CreateRoleCommand): Promise<CommandResult<number>> {
    const { role } = command;

    const validator = new Validator();
    validator
      .isString(role?.roleName ?? null, 'Role Name', true)
      .min(1)
      .max(30);

    if (validator.containsError()) {
      return new CommandResult<number>({
        statusCode: HttpStatus.BAD_REQUEST,
        validatorError: toValidationError(validator),
      });
    }

    const newRole = this.roleRepository.create({
      roleName: role.roleName,
    });

    const saved = await this.roleRepository.save(newRole);

    return {
      response: saved.id,
      statusCode: 200,
      isSuccess: true,
    };
  }
}
