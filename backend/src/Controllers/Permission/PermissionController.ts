import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { CreatePermissionCommand } from '../../Application/Command/Permission/CreatePermissionCommand';
import { DeletePermissionCommand } from '../../Application/Command/Permission/DeletePermissionCommand';
import { RolePermissionCommand } from '../../Application/Command/Role/RolePermissionCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetAllPermissionsQuery } from '../../Application/Queries/Permission/GetAllPermissionsQuery';
import { GetPermissionByIdQuery } from '../../Application/Queries/Permission/GetPermissionByIdQuery';
import { GetRolePermissionsQuery } from '../../Application/Queries/Permission/GetRolePermissionsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  AssignRolePermissionsDTO,
  CreatePermissionDTO,
  GetPermissionDTO,
  RolePermissionDTO,
} from '../../Models/DTO/Permission/Permission';
import { toHttpResult } from '../../Services/ResultHelper';

@ApiTags('Permissions')
@ApiExtraModels(
  QueryPageResult,
  QueryResult,
  GetPermissionDTO,
  RolePermissionDTO,
)
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreatePermissionDTO })
  async create(
    @Body() dto: CreatePermissionDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const result = await this.commandBus.execute(
      new CreatePermissionCommand(dto),
    );
    return toHttpResult(res, result);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const result = await this.commandBus.execute(
      new DeletePermissionCommand(requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetPermissionDTO)
  async getAll(
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetPermissionDTO[]>> {
    const result = await this.queryBus.execute(
      new GetAllPermissionsQuery(
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );
    return toHttpResult(res, result);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetPermissionDTO>> {
    const result = await this.queryBus.execute(
      new GetPermissionByIdQuery(requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Post('assign-role-permissions')
  @ApiBody({ type: AssignRolePermissionsDTO })
  async assignToRole(
    @Body() dto: AssignRolePermissionsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number[]>> {
    const result = await this.commandBus.execute(
      new RolePermissionCommand(dto),
    );
    return toHttpResult(res, result);
  }

  @Get('roles/:roleId')
  async getRolePermissions(
    @Param('roleId') roleId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<RolePermissionDTO>> {
    const result = await this.queryBus.execute(
      new GetRolePermissionsQuery(requirePositiveInteger(roleId, 'roleId')),
    );
    return toHttpResult(res, result);
  }
}
