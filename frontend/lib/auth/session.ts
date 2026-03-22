// src/lib/auth/session.ts
export type AuthSession = {
    token: string;
    tenantId: number;
    userId: string;
    fullName: string;
    email?: string;
    roleType?: string;
    phoneNumber?: string;
};

const AUTH_SESSION_KEY = 'auth_session';

export function getAuthSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;

    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        return null;
    }
}

export function saveAuthSession(session: AuthSession) {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}
