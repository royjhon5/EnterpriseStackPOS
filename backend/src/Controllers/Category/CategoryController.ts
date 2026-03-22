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
import { CreateCategoryCommand } from '../../Application/Command/Category/CreateCategoryCommand';
import { DeleteCategoryCommand } from '../../Application/Command/Category/DeleteCategoryCommand';
import { UpdateCategoryCommand } from '../../Application/Command/Category/UpdateCategoryCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetCategoriesQuery } from '../../Application/Queries/Category/GetCategoriesQuery';
import { GetCategoryByIdQuery } from '../../Application/Queries/Category/GetCategoryByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateCategoryDTO,
  GetCategoryDTO,
  UpdateCategoryDTO,
} from '../../Models/DTO/Category/CategoryApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Categories')
@ApiExtraModels(QueryPageResult, QueryResult, GetCategoryDTO)
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateCategoryDTO })
  async create(
    @Body() dto: CreateCategoryDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.commandBus.execute(
      new CreateCategoryCommand(tenantId, dto),
    );

    return toHttpResult(res, result);
  }

  @Get()
  @ApiPaginatedResponse(GetCategoryDTO)
  async findAll(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetCategoryDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.queryBus.execute(
      new GetCategoriesQuery(
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
  ): Promise<QueryResult<GetCategoryDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.queryBus.execute(
      new GetCategoryByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCategoryDTO })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);

    const result = await this.commandBus.execute(
      new UpdateCategoryCommand(
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

    const result = await this.commandBus.execute(
      new DeleteCategoryCommand(tenantId, requirePositiveInteger(id, 'id')),
    );

    return toHttpResult(res, result);
  }
}
