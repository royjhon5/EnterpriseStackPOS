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
import { CreateProductCommand } from '../../Application/Command/Product/CreateProductCommand';
import { DeleteProductCommand } from '../../Application/Command/Product/DeleteProductCommand';
import { UpdateProductCommand } from '../../Application/Command/Product/UpdateProductCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetProductByIdQuery } from '../../Application/Queries/Product/GetProductByIdQuery';
import { GetProductsQuery } from '../../Application/Queries/Product/GetProductsQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateProductDTO,
  GetProductDTO,
  UpdateProductDTO,
} from '../../Models/DTO/Product/ProductApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Products')
@ApiExtraModels(QueryPageResult, QueryResult, GetProductDTO)
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductDTO })
  async create(
    @Body() dto: CreateProductDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.commandBus.execute(
      new CreateProductCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetProductDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetProductDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.queryBus.execute(
      new GetProductsQuery(
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
  ): Promise<QueryResult<GetProductDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.queryBus.execute(
      new GetProductByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProductDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.commandBus.execute(
      new UpdateProductCommand(tenantId, requirePositiveInteger(id, 'id'), dto),
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

    const result = await this.commandBus.execute(
      new DeleteProductCommand(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
