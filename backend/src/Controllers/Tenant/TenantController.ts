import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateTenantCommand } from '../../Application/Command/Tenant/CreateTenantCommand';
import { DeleteTenantCommand } from '../../Application/Command/Tenant/DeleteTenantCommand';
import { UpdateTenantCommand } from '../../Application/Command/Tenant/UpdateTenantCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetAllTenantsQuery } from '../../Application/Queries/Tenant/GetAllTenantsQuery';
import { GetTenantByIdQuery } from '../../Application/Queries/Tenant/GetTenantByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import { UserId } from '../../Helpers/HttpUserId';
import {
  CreateTenantDTO,
  GetTenantDTO,
  UpdateTenantDTO,
} from '../../Models/DTO/Tenant/Tenant';
import { toHttpResult } from '../../Services/ResultHelper';

@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateTenantDTO })
  async create(
    @Body() dto: CreateTenantDTO,
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const result = await this.commandBus.execute(
      new CreateTenantCommand(userId.toString(), dto),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const result = await this.commandBus.execute(
      new UpdateTenantCommand(requirePositiveInteger(id, 'id'), dto),
    );

    return toHttpResult(res, result);
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const result = await this.commandBus.execute(
      new DeleteTenantCommand(requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetTenantDTO)
  async searchTenants(
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetTenantDTO[]>> {
    const result = await this.queryBus.execute(
      new GetAllTenantsQuery(
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }

  @Get(':id')
  @ApiPaginatedResponse(GetTenantDTO)
  async searchTenantById(
    @Param('id') id: string,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetTenantDTO[]>> {
    const result = await this.queryBus.execute(
      new GetTenantByIdQuery(
        requirePositiveInteger(id, 'id'),
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }
}
