'use client';

import { AuthSession } from '@/lib/auth/types';
import { useCallback, useEffect, useState } from 'react';

export function useAuthSession() {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/session', {
                method: 'GET',
                credentials: 'include',
                cache: 'no-store',
            });

            if (!response.ok) {
                setSession(null);
                return;
            }

            const payload = (await response.json()) as { session?: AuthSession | null };
            setSession(payload.session ?? null);
        } catch {
            setSession(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSession();
    }, [refreshSession]);

    return {
        session,
        isLoading,
        refreshSession,
    };
}
