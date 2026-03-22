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
import { CloseShiftCommand } from '../../Application/Command/POS/CloseShiftCommand';
import { CreatePOSDeviceCommand } from '../../Application/Command/POS/CreatePOSDeviceCommand';
import { DeletePOSDeviceCommand } from '../../Application/Command/POS/DeletePOSDeviceCommand';
import { OpenShiftCommand } from '../../Application/Command/POS/OpenShiftCommand';
import { UpdatePOSDeviceCommand } from '../../Application/Command/POS/UpdatePOSDeviceCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetPOSDeviceByIdQuery } from '../../Application/Queries/POS/GetPOSDeviceByIdQuery';
import { GetPOSDevicesQuery } from '../../Application/Queries/POS/GetPOSDevicesQuery';
import { GetShiftByIdQuery } from '../../Application/Queries/POS/GetShiftByIdQuery';
import { GetShiftsQuery } from '../../Application/Queries/POS/GetShiftsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CloseShiftDTO,
  CreatePOSDeviceDTO,
  GetPOSDeviceDTO,
  GetShiftDTO,
  OpenShiftDTO,
  UpdatePOSDeviceDTO,
} from '../../Models/DTO/POS/POSApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('POS Operations')
@ApiExtraModels(QueryPageResult, QueryResult, GetPOSDeviceDTO, GetShiftDTO)
@UseGuards(JwtAuthGuard)
@Controller()
export class POSController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('pos-devices')
  @ApiBody({ type: CreatePOSDeviceDTO })
  async createDevice(
    @Body() dto: CreatePOSDeviceDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreatePOSDeviceCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get('pos-devices')
  @ApiPaginatedResponse(GetPOSDeviceDTO)
  async findDevices(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetPOSDeviceDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetPOSDeviceDTO[]> =
      await this.queryBus.execute(
        new GetPOSDevicesQuery(
          tenantId,
          searchKey,
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get('pos-devices/:id')
  async findDeviceById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetPOSDeviceDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetPOSDeviceDTO> = await this.queryBus.execute(
      new GetPOSDeviceByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put('pos-devices/:id')
  @ApiBody({ type: UpdatePOSDeviceDTO })
  async updateDevice(
    @Param('id') id: string,
    @Body() dto: UpdatePOSDeviceDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdatePOSDeviceCommand(
        tenantId,
        requirePositiveInteger(id, 'id'),
        dto,
      ),
    );
    return toHttpResult(res, result);
  }

  @Delete('pos-devices/:id')
  async deleteDevice(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<boolean> = await this.commandBus.execute(
      new DeletePOSDeviceCommand(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Post('shifts')
  @ApiBody({ type: OpenShiftDTO })
  async openShift(
    @Body() dto: OpenShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new OpenShiftCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get('shifts')
  @ApiPaginatedResponse(GetShiftDTO)
  async findShifts(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetShiftDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetShiftDTO[]> = await this.queryBus.execute(
      new GetShiftsQuery(
        tenantId,
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );
    return toHttpResult(res, result);
  }

  @Get('shifts/:id')
  async findShiftById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetShiftDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetShiftDTO> = await this.queryBus.execute(
      new GetShiftByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put('shifts/:id/close')
  @ApiBody({ type: CloseShiftDTO })
  async closeShift(
    @Param('id') id: string,
    @Body() dto: CloseShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CloseShiftCommand(tenantId, requirePositiveInteger(id, 'id'), dto),
    );
    return toHttpResult(res, result);
  }
}
