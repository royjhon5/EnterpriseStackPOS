import { ICommand } from '@nestjs/cqrs';
import { RoleDTO } from '../../../Models/DTO/Role/Role';

export class CreateRoleCommand implements ICommand {
  constructor(public readonly role: RoleDTO) {}
}
