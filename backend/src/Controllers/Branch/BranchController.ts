import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateBranchCommand } from '../../Application/Command/Branch/CreateBranchCommand';
import { DeleteBranchCommand } from '../../Application/Command/Branch/DeleteBranchCommand';
import { UpdateBranchCommand } from '../../Application/Command/Branch/UpdateBranchCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetAllBranchQuery } from '../../Application/Queries/Branch/GetAllBranchQuery';
import { GetBranchDetailByIdQuery } from '../../Application/Queries/Branch/GetBranchDetailByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateBranchDTO,
  GetBranchDTO,
  UpdateBranchDTO,
} from '../../Models/DTO/Branch/Branch';
import { toHttpResult } from '../../Services/ResultHelper';

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBody({ type: CreateBranchDTO })
  async create(@Body() dto: CreateBranchDTO): Promise<CommandResult<number>> {
    return this.commandBus.execute(new CreateBranchCommand(dto));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDTO,
  ): Promise<CommandResult<number>> {
    return this.commandBus.execute(
      new UpdateBranchCommand(requirePositiveInteger(id, 'id'), dto),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CommandResult<number>> {
    return this.commandBus.execute(
      new DeleteBranchCommand(requirePositiveInteger(id, 'id')),
    );
  }

  @Get()
  @ApiPaginatedResponse(GetBranchDTO)
  async getAllBranches(
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetBranchDTO[]>> {
    const result = await this.queryBus.execute(
      new GetAllBranchQuery(
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }

  @Get(':id')
  @ApiPaginatedResponse(GetBranchDTO)
  async getBranchById(
    @Param('id') id: string,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetBranchDTO[]>> {
    const result = await this.queryBus.execute(
      new GetBranchDetailByIdQuery(
        requirePositiveInteger(id, 'id'),
        searchKey,
        createExtendedParameters(pageNumber, pageSize),
      ),
    );

    return toHttpResult(res, result);
  }
}
