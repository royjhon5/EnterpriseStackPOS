import { ExecutionContext } from '@nestjs/common';
import { TenantHeaderGuard } from './TenantHeaderGuard';

describe('TenantHeaderGuard', () => {
  const guard = new TenantHeaderGuard();

  it('stores the parsed tenant id on the request', () => {
    const request: { headers: Record<string, string>; tenantId?: number } = {
      headers: { 'x-tenant-id': '42' },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(request.tenantId).toBe(42);
  });

  it('throws when the tenant header is missing', () => {
    const request = { headers: {} };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(
      'TenantId header is required.',
    );
  });
});
