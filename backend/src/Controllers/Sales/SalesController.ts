import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CreateSaleCommand } from '../../Application/Command/Sales/CreateSaleCommand';
import { VoidSaleCommand } from '../../Application/Command/Sales/VoidSaleCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetSaleByIdQuery } from '../../Application/Queries/Sales/GetSaleByIdQuery';
import { GetSalesQuery } from '../../Application/Queries/Sales/GetSalesQuery';
import { GetSalesSummaryQuery } from '../../Application/Queries/Sales/GetSalesSummaryQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import { UserId } from '../../Helpers/HttpUserId';
import {
  CreateSaleDTO,
  GetSaleDTO,
  GetSalesSummaryDTO,
} from '../../Models/DTO/Sales/SaleHeader';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Sales')
@ApiExtraModels(QueryPageResult, QueryResult, GetSaleDTO, GetSalesSummaryDTO)
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateSaleDTO })
  async create(
    @Body() dto: CreateSaleDTO,
    @Req() req: Request,
    @UserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateSaleCommand(tenantId, userId, dto),
    );

    return toHttpResult(res, result);
  }

  @Patch(':id/void')
  async voidSale(
    @Param('id') id: string,
    @Req() req: Request,
    @UserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<boolean> = await this.commandBus.execute(
      new VoidSaleCommand(tenantId, requirePositiveInteger(id, 'id'), userId),
    );

    return toHttpResult(res, result);
  }

  @Get('summary')
  async getSummary(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<QueryResult<GetSalesSummaryDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetSalesSummaryDTO> = await this.queryBus.execute(
      new GetSalesSummaryQuery(tenantId, dateFrom, dateTo),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetSaleDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetSaleDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetSaleDTO[]> = await this.queryBus.execute(
      new GetSalesQuery(
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
  ): Promise<QueryResult<GetSaleDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetSaleDTO> = await this.queryBus.execute(
      new GetSaleByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
