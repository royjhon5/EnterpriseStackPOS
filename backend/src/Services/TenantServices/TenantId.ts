import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTenantIdFromHeader } from './TenantHeader';

type TenantRequest = {
  headers: Record<string, unknown>;
  tenantId?: number;
};

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenantId ?? getTenantIdFromHeader(request.headers);
  },
);
