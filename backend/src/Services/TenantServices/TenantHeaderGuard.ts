import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getTenantIdFromHeader } from './TenantHeader';

type TenantRequest = {
  headers: Record<string, unknown>;
  tenantId?: number;
};

@Injectable()
export class TenantHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    request.tenantId = getTenantIdFromHeader(request.headers);
    return true;
  }
}
