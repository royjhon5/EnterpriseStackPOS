import { AssignRolePermissionsDTO } from '../../../Models/DTO/Permission/Permission';

export class RolePermissionCommand {
  constructor(public readonly payload: AssignRolePermissionsDTO) {}
}
