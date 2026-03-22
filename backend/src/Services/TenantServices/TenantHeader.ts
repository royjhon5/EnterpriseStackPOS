// src/Common/Http/tenant-header.ts
import { BadRequestException } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';

export function getTenantIdFromHeader(headers: IncomingHttpHeaders): number {
  const raw =
    headers['tenantid'] ?? headers['tenant-id'] ?? headers['x-tenant-id'];

  if (raw === undefined || raw === null || raw === '') {
    throw new BadRequestException('TenantId header is required.');
  }

  const tenantId = Number(raw);
  if (Number.isNaN(tenantId) || tenantId <= 0) {
    throw new BadRequestException('TenantId header must be a valid number.');
  }

  return tenantId;
}
