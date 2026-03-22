import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiTenantHeader() {
  return applyDecorators(
    ApiHeader({
      name: 'x-tenant-id',
      required: true,
      description:
        'Tenant identifier required for tenant-scoped endpoints. `tenantid` and `tenant-id` are also accepted.',
    }),
  );
}
