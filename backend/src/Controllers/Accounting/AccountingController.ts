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
import { CreateAccountCommand } from '../../Application/Command/Accounting/CreateAccountCommand';
import { CreateJournalEntryCommand } from '../../Application/Command/Accounting/CreateJournalEntryCommand';
import { DeleteAccountCommand } from '../../Application/Command/Accounting/DeleteAccountCommand';
import { UpdateAccountCommand } from '../../Application/Command/Accounting/UpdateAccountCommand';
import { CommandResult } from '../../Application/CommandResult';
import { GetAccountByIdQuery } from '../../Application/Queries/Accounting/GetAccountByIdQuery';
import { GetAccountsQuery } from '../../Application/Queries/Accounting/GetAccountsQuery';
import { GetJournalEntriesQuery } from '../../Application/Queries/Accounting/GetJournalEntriesQuery';
import { GetJournalEntryByIdQuery } from '../../Application/Queries/Accounting/GetJournalEntryByIdQuery';
import { QueryPageResult } from '../../Application/QueryPageResult';
import { QueryResult } from '../../Application/QueryResult';
import { JwtAuthGuard } from '../../Configurations/Registrar/jwt-auth.guard';
import {
  ApiPaginatedResponse,
  createExtendedParameters,
  requirePositiveInteger,
} from '../../Controllers/controller-helpers';
import {
  CreateAccountDTO,
  CreateJournalEntryDTO,
  GetAccountDTO,
  GetJournalEntryDTO,
  UpdateAccountDTO,
} from '../../Models/DTO/Accounting/AccountingApi';
import { toHttpResult } from '../../Services/ResultHelper';
import { getTenantIdFromHeader } from '../../Services/TenantServices/TenantHeader';

@ApiTags('Accounting')
@ApiExtraModels(QueryPageResult, QueryResult, GetAccountDTO, GetJournalEntryDTO)
@UseGuards(JwtAuthGuard)
@Controller()
export class AccountingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('accounts')
  @ApiBody({ type: CreateAccountDTO })
  async createAccount(
    @Body() dto: CreateAccountDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateAccountCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get('accounts')
  @ApiPaginatedResponse(GetAccountDTO)
  async findAccounts(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetAccountDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetAccountDTO[]> =
      await this.queryBus.execute(
        new GetAccountsQuery(
          tenantId,
          searchKey,
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get('accounts/:id')
  async findAccountById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetAccountDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetAccountDTO> = await this.queryBus.execute(
      new GetAccountByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Put('accounts/:id')
  @ApiBody({ type: UpdateAccountDTO })
  async updateAccount(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new UpdateAccountCommand(tenantId, requirePositiveInteger(id, 'id'), dto),
    );
    return toHttpResult(res, result);
  }

  @Delete('accounts/:id')
  async deleteAccount(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<boolean>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<boolean> = await this.commandBus.execute(
      new DeleteAccountCommand(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }

  @Post('journal-entries')
  @ApiBody({ type: CreateJournalEntryDTO })
  async createJournalEntry(
    @Body() dto: CreateJournalEntryDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommandResult<number>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: CommandResult<number> = await this.commandBus.execute(
      new CreateJournalEntryCommand(tenantId, dto),
    );
    return toHttpResult(res, result);
  }

  @Get('journal-entries')
  @ApiPaginatedResponse(GetJournalEntryDTO)
  async findJournalEntries(
    @Req() req: Request,
    @Query('searchKey') searchKey: string,
    @Res({ passthrough: true }) res: Response,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QueryPageResult<GetJournalEntryDTO[]>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryPageResult<GetJournalEntryDTO[]> =
      await this.queryBus.execute(
        new GetJournalEntriesQuery(
          tenantId,
          searchKey,
          createExtendedParameters(pageNumber, pageSize),
        ),
      );
    return toHttpResult(res, result);
  }

  @Get('journal-entries/:id')
  async findJournalEntryById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<QueryResult<GetJournalEntryDTO>> {
    const tenantId = getTenantIdFromHeader(req.headers);
    const result: QueryResult<GetJournalEntryDTO> = await this.queryBus.execute(
      new GetJournalEntryByIdQuery(tenantId, requirePositiveInteger(id, 'id')),
    );
    return toHttpResult(res, result);
  }
}
