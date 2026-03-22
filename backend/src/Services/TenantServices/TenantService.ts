import { Injectable, NotFoundException } from '@nestjs/common';
import { Tenant } from '../../Domain/Entities/Tenant/Tenant';
import { ITenantService } from '../../Services/TenantServices/ITenantService';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TenantService implements ITenantService {
  private _tenantId = 1;

  private tenantRepository: Repository<Tenant>;

  constructor(private readonly dataSource: DataSource) {
    this.tenantRepository = this.dataSource.getRepository(Tenant);
  }

  get currentTenantId(): number {
    return this._tenantId;
  }

  async setTenantAsync(host: string): Promise<void> {
    host = host?.toLowerCase() || 'localhost';

    const tenant = await this.tenantRepository.findOne({
      where: [{ code: host }, { name: host }],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant not found for host: ${host}`);
    }

    this._tenantId = tenant.id;
  }
}
