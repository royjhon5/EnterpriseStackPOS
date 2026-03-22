import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CreateInventoryMovementCommand } from '../../Application/Command/InventoryMovement/CreateInventoryMovementCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetInventoryMovementByIdQuery } from '../../Application/Queries/InventoryMovement/GetInventoryMovementByIdQuery';
import { GetInventoryMovementsQuery } from '../../Application/Queries/InventoryMovement/GetInventoryMovementsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateInventoryMovementDTO,
  GetInventoryMovementDTO,
} from '../../Models/DTO/Inventory/InventoryMovement';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Inventory Movements')
@ApiExtraModels(QueryPageResult, QueryResult, GetInventoryMovementDTO)
@UseGuards(JwtAuthGuard)
@Controller('inventory-movements')
export class InventoryMovementController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateInventoryMovementDTO })
  async create(
    @Body() dto: CreateInventoryMovementDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateInventoryMovementCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetInventoryMovementDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetInventoryMovementDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetInventoryMovementDTO[]> =
      await this.queryBus.execute(
        new GetInventoryMovementsQuery(
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
  ): Promise<QueryResult<GetInventoryMovementDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetInventoryMovementDTO> =
      await this.queryBus.execute(
        new GetInventoryMovementByIdQuery(
          tenantId,
          requirePositiveInteger(id, 'id'),
        ),
      );

    return toHttpResult(res, result);
  }
}
