import { AuthSession } from '@/lib/auth/types';

export function encodeAuthSession(session: AuthSession): string {
    return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

export function decodeAuthSession(value: string): AuthSession | null {
    try {
        const decoded = Buffer.from(value, 'base64url').toString('utf8');
        const parsed = JSON.parse(decoded) as Partial<AuthSession>;

        if (!parsed.token || !parsed.userId || typeof parsed.tenantId !== 'number' || !parsed.fullName) {
            return null;
        }

        return {
            token: parsed.token,
            tenantId: parsed.tenantId,
            userId: parsed.userId,
            fullName: parsed.fullName,
            email: parsed.email,
            roleType: parsed.roleType,
            phoneNumber: parsed.phoneNumber,
        };
    } catch {
        return null;
    }
}
