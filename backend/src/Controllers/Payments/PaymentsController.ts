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
import { CreatePaymentCommand } from '../../Application/Command/Payments/CreatePaymentCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetPaymentByIdQuery } from '../../Application/Queries/Payments/GetPaymentByIdQuery';
import { GetPaymentsQuery } from '../../Application/Queries/Payments/GetPaymentsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreatePaymentDTO,
  GetPaymentDTO,
} from '../../Models/DTO/Transaction/Payment';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Payments')
@ApiExtraModels(QueryPageResult, QueryResult, GetPaymentDTO)
@UseGuards(JwtAuthGuard)
@Controller('sales/:saleId/payments')
export class PaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreatePaymentDTO })
  async create(
    @Param('saleId') saleId: string,
    @Body() dto: CreatePaymentDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreatePaymentCommand(
        tenantId,
        requirePositiveInteger(saleId, 'saleId'),
        dto,
      ),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetPaymentDTO)
  async findAll(
    @Param('saleId') saleId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetPaymentDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetPaymentDTO[]> =
      await this.queryBus.execute(
        new GetPaymentsQuery(
          tenantId,
          requirePositiveInteger(saleId, 'saleId'),
          createExtendedParameters(pageNumber, pageSize),
        ),
      );

    return toHttpResult(res, result);
  }

  @Get(':paymentId')
  async findOne(
    @Param('saleId') saleId: string,
    @Param('paymentId') paymentId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetPaymentDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetPaymentDTO> = await this.queryBus.execute(
      new GetPaymentByIdQuery(
        tenantId,
        requirePositiveInteger(saleId, 'saleId'),
        requirePositiveInteger(paymentId, 'paymentId'),
      ),
    );

    return toHttpResult(res, result);
  }
}
