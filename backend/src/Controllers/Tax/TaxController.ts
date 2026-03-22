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
import { CreateTaxCommand } from '../../Application/Command/Tax/CreateTaxCommand';
import { DeleteTaxCommand } from '../../Application/Command/Tax/DeleteTaxCommand';
import { UpdateTaxCommand } from '../../Application/Command/Tax/UpdateTaxCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetTaxByIdQuery } from '../../Application/Queries/Tax/GetTaxByIdQuery';
import { GetTaxesQuery } from '../../Application/Queries/Tax/GetTaxesQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateTaxDTO,
  GetTaxDTO,
  UpdateTaxDTO,
} from '../../Models/DTO/Tax/TaxApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Taxes')
@ApiExtraModels(QueryPageResult, QueryResult, GetTaxDTO)
@UseGuards(JwtAuthGuard)
@Controller('taxes')
export class TaxController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateTaxDTO })
  async create(
    @Body() dto: CreateTaxDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateTaxCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetTaxDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetTaxDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetTaxDTO[]> = await this.queryBus.execute(
      new GetTaxesQuery(
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
  ): Promise<QueryResult<GetTaxDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetTaxDTO> = await this.queryBus.execute(
      new GetTaxByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTaxDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaxDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdateTaxCommand(tenantId, requirePositiveInteger(id, 'id'), dto),
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
      new DeleteTaxCommand(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }
}
