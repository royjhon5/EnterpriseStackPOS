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
import { CreateSalesReturnCommand } from '../../Application/Command/SalesReturn/CreateSalesReturnCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetSalesReturnByIdQuery } from '../../Application/Queries/SalesReturn/GetSalesReturnByIdQuery';
import { GetSalesReturnsQuery } from '../../Application/Queries/SalesReturn/GetSalesReturnsQuery';
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
  CreateSalesReturnDTO,
  GetSalesReturnDTO,
} from '../../Models/DTO/SalesReturn/SalesReturn';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Sales Returns')
@ApiExtraModels(QueryPageResult, QueryResult, GetSalesReturnDTO)
@UseGuards(JwtAuthGuard)
@Controller('sales-returns')
export class SalesReturnController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateSalesReturnDTO })
  async create(
    @Body() dto: CreateSalesReturnDTO,
    @Req() req: Request,
    @UserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateSalesReturnCommand(tenantId, userId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetSalesReturnDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetSalesReturnDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetSalesReturnDTO[]> =
      await this.queryBus.execute(
        new GetSalesReturnsQuery(
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
  ): Promise<QueryResult<GetSalesReturnDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetSalesReturnDTO> = await this.queryBus.execute(
      new GetSalesReturnByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
