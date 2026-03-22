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
import { GenerateDailySalesSummariesCommand } from '../../Application/Command/Summary/GenerateDailySalesSummariesCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetDailySalesSummariesQuery } from '../../Application/Queries/Summary/GetDailySalesSummariesQuery';
import { GetDailySalesSummaryByIdQuery } from '../../Application/Queries/Summary/GetDailySalesSummaryByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  GenerateDailySalesSummariesDTO,
  GetDailySalesSummaryDTO,
} from '../../Models/DTO/Summary/DailySalesApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Reporting')
@ApiExtraModels(QueryPageResult, QueryResult, GetDailySalesSummaryDTO)
@UseGuards(JwtAuthGuard)
@Controller('reports/daily-sales-summaries')
export class DailySalesSummaryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('generate')
  @ApiBody({ type: GenerateDailySalesSummariesDTO })
  async generate(
    @Body() dto: GenerateDailySalesSummariesDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new GenerateDailySalesSummariesCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetDailySalesSummaryDTO)
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('branchId') branchId?: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetDailySalesSummaryDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetDailySalesSummaryDTO[]> =
      await this.queryBus.execute(
        new GetDailySalesSummariesQuery(
          tenantId,
          dateFrom,
          dateTo,
          branchId ? requirePositiveInteger(branchId, 'branchId') : undefined,
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
  ): Promise<QueryResult<GetDailySalesSummaryDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetDailySalesSummaryDTO> =
      await this.queryBus.execute(
        new GetDailySalesSummaryByIdQuery(
          tenantId,
          requirePositiveInteger(id, 'id'),
        ),
      );

    return toHttpResult(res, result);
  }
}
