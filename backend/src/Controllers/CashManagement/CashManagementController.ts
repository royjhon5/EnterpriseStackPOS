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
import { CloseCashSessionCommand } from '../../Application/Command/CashManagement/CloseCashSessionCommand';
import { CreateCashMovementCommand } from '../../Application/Command/CashManagement/CreateCashMovementCommand';
import { OpenCashSessionCommand } from '../../Application/Command/CashManagement/OpenCashSessionCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetCashMovementByIdQuery } from '../../Application/Queries/CashManagement/GetCashMovementByIdQuery';
import { GetCashMovementsQuery } from '../../Application/Queries/CashManagement/GetCashMovementsQuery';
import { GetCashSessionByIdQuery } from '../../Application/Queries/CashManagement/GetCashSessionByIdQuery';
import { GetCashSessionsQuery } from '../../Application/Queries/CashManagement/GetCashSessionsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CloseCashSessionDTO,
  CreateCashMovementDTO,
  GetCashMovementDTO,
  GetCashSessionDTO,
  OpenCashSessionDTO,
} from '../../Models/DTO/CashManagement/CashManagementApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Cash Management')
@ApiExtraModels(
  QueryPageResult,
  QueryResult,
  GetCashSessionDTO,
  GetCashMovementDTO,
)
@UseGuards(JwtAuthGuard)
@Controller('cash-sessions')
export class CashManagementController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: OpenCashSessionDTO })
  async openSession(
    @Body() dto: OpenCashSessionDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new OpenCashSessionCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetCashSessionDTO)
  async findSessions(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetCashSessionDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetCashSessionDTO[]> =
      await this.queryBus.execute(
        new GetCashSessionsQuery(
          tenantId,
          searchKey,
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get(':id')
  async findSessionById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetCashSessionDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetCashSessionDTO> = await this.queryBus.execute(
      new GetCashSessionByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put(':id/close')
  @ApiBody({ type: CloseCashSessionDTO })
  async closeSession(
    @Param('id') id: string,
    @Body() dto: CloseCashSessionDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CloseCashSessionCommand(
        tenantId,
        requirePositiveInteger(id, 'id'),
        dto,
      ),
    );
    return toHttpResult(res, result);
  }

  @Post(':sessionId/movements')
  @ApiBody({ type: CreateCashMovementDTO })
  async createMovement(
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateCashMovementDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateCashMovementCommand(
        tenantId,
        requirePositiveInteger(sessionId, 'sessionId'),
        dto,
      ),
    );
    return toHttpResult(res, result);
  }

  @Get(':sessionId/movements')
  @ApiPaginatedResponse(GetCashMovementDTO)
  async findMovements(
    @Param('sessionId') sessionId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetCashMovementDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetCashMovementDTO[]> =
      await this.queryBus.execute(
        new GetCashMovementsQuery(
          tenantId,
          requirePositiveInteger(sessionId, 'sessionId'),
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get(':sessionId/movements/:movementId')
  async findMovementById(
    @Param('sessionId') sessionId: string,
    @Param('movementId') movementId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetCashMovementDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetCashMovementDTO> = await this.queryBus.execute(
      new GetCashMovementByIdQuery(
        tenantId,
        requirePositiveInteger(sessionId, 'sessionId'),
        requirePositiveInteger(movementId, 'movementId'),
      ),
    );
    return toHttpResult(res, result);
  }
}
