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
import { CreatePriceListCommand } from '../../Application/Command/Pricing/CreatePriceListCommand';
import { DeletePriceListCommand } from '../../Application/Command/Pricing/DeletePriceListCommand';
import { UpdatePriceListCommand } from '../../Application/Command/Pricing/UpdatePriceListCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetPriceListByIdQuery } from '../../Application/Queries/Pricing/GetPriceListByIdQuery';
import { GetPriceListsQuery } from '../../Application/Queries/Pricing/GetPriceListsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreatePriceListDTO,
  GetPriceListDTO,
  UpdatePriceListDTO,
} from '../../Models/DTO/Pricing/PricingApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Pricing')
@ApiExtraModels(QueryPageResult, QueryResult, GetPriceListDTO)
@UseGuards(JwtAuthGuard)
@Controller('price-lists')
export class PricingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreatePriceListDTO })
  async create(
    @Body() dto: CreatePriceListDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreatePriceListCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetPriceListDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetPriceListDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetPriceListDTO[]> =
      await this.queryBus.execute(
        new GetPriceListsQuery(
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
  ): Promise<QueryResult<GetPriceListDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetPriceListDTO> = await this.queryBus.execute(
      new GetPriceListByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdatePriceListDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePriceListDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdatePriceListCommand(
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
      new DeletePriceListCommand(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }
}
