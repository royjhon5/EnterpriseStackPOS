import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CancelInventoryCountCommand } from '../../Application/Command/InventoryCount/CancelInventoryCountCommand';
import { CreateInventoryCountCommand } from '../../Application/Command/InventoryCount/CreateInventoryCountCommand';
import { PostInventoryCountCommand } from '../../Application/Command/InventoryCount/PostInventoryCountCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetInventoryCountByIdQuery } from '../../Application/Queries/InventoryCount/GetInventoryCountByIdQuery';
import { GetInventoryCountsQuery } from '../../Application/Queries/InventoryCount/GetInventoryCountsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateInventoryCountDTO,
  GetInventoryCountDTO,
} from '../../Models/DTO/Inventory/InventoryCountApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Inventory Counts')
@ApiExtraModels(QueryPageResult, QueryResult, GetInventoryCountDTO)
@UseGuards(JwtAuthGuard)
@Controller('inventory-counts')
export class InventoryCountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateInventoryCountDTO })
  async create(
    @Body() dto: CreateInventoryCountDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateInventoryCountCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetInventoryCountDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetInventoryCountDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetInventoryCountDTO[]> =
      await this.queryBus.execute(
        new GetInventoryCountsQuery(
          tenantId,
          searchKey,
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetInventoryCountDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetInventoryCountDTO> =
      await this.queryBus.execute(
        new GetInventoryCountByIdQuery(
          tenantId,
          requirePositiveInteger(id, 'id'),
        ),
      );
    return toHttpResult(res, result);
  }

  @Put(':id/post')
  async postCount(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new PostInventoryCountCommand(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put(':id/cancel')
  async cancelCount(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CancelInventoryCountCommand(
        tenantId,
        requirePositiveInteger(id, 'id'),
      ),
    );
    return toHttpResult(res, result);
  }
}
