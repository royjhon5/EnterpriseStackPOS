import {
  Body,
  Controller,
  Delete,
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
import { CreateInventoryCommand } from '../../Application/Command/Inventory/CreateInventoryCommand';
import { DeleteInventoryCommand } from '../../Application/Command/Inventory/DeleteInventoryCommand';
import { UpdateInventoryCommand } from '../../Application/Command/Inventory/UpdateInventoryCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetInventoriesQuery } from '../../Application/Queries/Inventory/GetInventoriesQuery';
import { GetInventoryByIdQuery } from '../../Application/Queries/Inventory/GetInventoryByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateInventoryDTO,
  GetInventoryDTO,
  UpdateInventoryDTO,
} from '../../Models/DTO/Inventory/Inventory';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Inventory')
@ApiExtraModels(QueryPageResult, QueryResult, GetInventoryDTO)
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateInventoryDTO })
  async create(
    @Body() dto: CreateInventoryDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateInventoryCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetInventoryDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetInventoryDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetInventoryDTO[]> =
      await this.queryBus.execute(
        new GetInventoriesQuery(
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
  ): Promise<QueryResult<GetInventoryDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetInventoryDTO> = await this.queryBus.execute(
      new GetInventoryByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdateInventoryDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdateInventoryCommand(
        tenantId,
        requirePositiveInteger(id, 'id'),
        dto,
      ),
    );

    return toHttpResult(res, result);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<boolean> = await this.commandBus.execute(
      new DeleteInventoryCommand(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
