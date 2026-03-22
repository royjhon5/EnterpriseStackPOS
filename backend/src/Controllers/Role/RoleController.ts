import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody } from '@nestjs/swagger';
import { CreateRoleCommand } from '../../Application/Command/Role/CreateRoleCommand';
import { DeleteRoleCommand } from '../../Application/Command/Role/DeleteRoleCommand';
import { UpdateRoleCommand } from '../../Application/Command/Role/UpdateRoleCommand';
import { CommandResult } from '../../Application/CommandResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import { requirePositiveInteger } from '../../Controllers/controller-helpers';
import { RoleDTO, UpdateRoleDTO } from '../../Models/DTO/Role/Role';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiBody({ type: RoleDTO })
  async create(@Body() dto: RoleDTO): Promise<CommandResult<number>> {
    return this.commandBus.execute(new CreateRoleCommand(dto));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDTO,
  ): Promise<CommandResult<number>> {
    return this.commandBus.execute(
      new UpdateRoleCommand(requirePositiveInteger(id, 'id'), dto),
    );
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<CommandResult<boolean>> {
    return this.commandBus.execute(
      new DeleteRoleCommand(requirePositiveInteger(id, 'id')),
    );
  }
}
