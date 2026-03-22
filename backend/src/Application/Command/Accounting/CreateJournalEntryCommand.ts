import { CreateJournalEntryDTO } from '../../../Models/DTO/Accounting/AccountingApi';

export class CreateJournalEntryCommand {
  constructor(
    public readonly tenantId: number,
    public readonly journalEntry: CreateJournalEntryDTO,
  ) {}
}
