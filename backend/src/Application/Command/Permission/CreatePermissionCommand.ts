import { CreatePermissionDTO } from '../../../Models/DTO/Permission/Permission';

export class CreatePermissionCommand {
  constructor(public readonly permission: CreatePermissionDTO) {}
}
