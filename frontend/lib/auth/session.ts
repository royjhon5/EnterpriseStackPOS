import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { decodeAuthSession } from '@/lib/auth/session-codec';
import { AuthSession, BackendLoginResponse } from '@/lib/auth/types';

export function mapBackendSession(payload: BackendLoginResponse): AuthSession {
    return {
        token: payload.Token,
        tenantId: payload.TenantId,
        userId: payload.UserId,
        fullName: payload.FullName,
        email: payload.Email,
        roleType: payload.RoleType,
        phoneNumber: payload.phoneNumber,
    };
}

export async function getServerAuthSession(): Promise<AuthSession | null> {
    const cookieStore = await cookies();
    const encoded = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!encoded) {
        return null;
    }

    return decodeAuthSession(encoded);
}
