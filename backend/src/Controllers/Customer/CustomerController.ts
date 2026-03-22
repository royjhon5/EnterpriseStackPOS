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
import { CreateCustomerCommand } from '../../Application/Command/Customer/CreateCustomerCommand';
import { DeleteCustomerCommand } from '../../Application/Command/Customer/DeleteCustomerCommand';
import { UpdateCustomerCommand } from '../../Application/Command/Customer/UpdateCustomerCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetCustomerByIdQuery } from '../../Application/Queries/Customer/GetCustomerByIdQuery';
import { GetCustomersQuery } from '../../Application/Queries/Customer/GetCustomersQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateCustomerDTO,
  GetCustomerDTO,
  UpdateCustomerDTO,
} from '../../Models/DTO/Customer/Customer';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Customers')
@ApiExtraModels(QueryPageResult, QueryResult, GetCustomerDTO)
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateCustomerDTO })
  async create(
    @Body() dto: CreateCustomerDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateCustomerCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetCustomerDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetCustomerDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryPageResult<GetCustomerDTO[]> =
      await this.queryBus.execute(
        new GetCustomersQuery(
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
  ): Promise<QueryResult<GetCustomerDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: QueryResult<GetCustomerDTO> = await this.queryBus.execute(
      new GetCustomerByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCustomerDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdateCustomerCommand(
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
      new DeleteCustomerCommand(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
