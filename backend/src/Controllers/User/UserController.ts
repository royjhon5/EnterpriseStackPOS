import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExtraModels } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CreateUserCommand } from 'src/Application/Command/User/CreateUserCommand';
import { DeleteUserCommand } from 'src/Application/Command/User/DeleteUserCommand';
import { UpdateUserCommand } from 'src/Application/Command/User/UpdateUserCommand';
import { ActivateUserCommand } from '../../Application/Command/User/ActivateUserCommand';
import { DeActivateUserCommand } from '../../Application/Command/User/DeActivateUserCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetUserDetailsQuery } from '../../Application/Queries/User/GetUserDetailsQuery';
import { GetUserQuery } from '../../Application/Queries/User/GetUserQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateUserDTO,
  GetUserDTO,
  UpdateUserDTO,
} from '../../Models/DTO/User/User';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiExtraModels(QueryPageResult, GetUserDTO)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() model: CreateUserDTO,
    @Query('role') role: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<string>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result = await this.commandBus.execute(
      new CreateUserCommand(model, tenantId, role),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetUserDTO)
  async findAll(
    @Query('tenantId') tenantIdQuery: string,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetUserDTO>> {
    const tenantId = requirePositiveInteger(tenantIdQuery, 'tenantId');

    const result = await this.queryBus.execute(
      new GetUserQuery(
        tenantId,
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }

  @Get(':id')
  @ApiPaginatedResponse(GetUserDTO)
  async findOne(
    @Param('id') id: string,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetUserDTO>> {
    const result = await this.queryBus.execute(
      new GetUserDetailsQuery(
        requirePositiveInteger(id, 'id'),
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() model: UpdateUserDTO,
    @Query('role') role: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<string>> {
    const result = await this.commandBus.execute(
      new UpdateUserCommand(id, model, role),
    );

    return toHttpResult(res, result);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    return toHttpResult(res, result);
  }

  @Patch(':id/activate')
  async activateUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<string>> {
    const result = await this.commandBus.execute(new ActivateUserCommand(id));
    return toHttpResult(res, result);
  }

  @Patch(':id/deactivate')
  async deactivateUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<string>> {
    const result = await this.commandBus.execute(new DeActivateUserCommand(id));
    return toHttpResult(res, result);
  }
}
