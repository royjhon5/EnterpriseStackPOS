import { AUTH_COOKIE_MAX_AGE_SECONDS, AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { encodeAuthSession } from '@/lib/auth/session-codec';
import { mapBackendSession } from '@/lib/auth/session';
import { ApiResult } from '@/types/result';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BackendLoginResponse } from '@/lib/auth/types';

function resolveBackendUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
    }

    return new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as { username?: string; password?: string };

        const response = await fetch(resolveBackendUrl('auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserName: body.username?.trim(),
                Password: body.password,
            }),
            cache: 'no-store',
        });

        const result = (await response.json()) as ApiResult<BackendLoginResponse>;
        const errorMessage = result.validatorError?.message || (!result.response ? 'Authentication failed.' : null);

        if (!response.ok || errorMessage || !result.response) {
            return NextResponse.json(
                {
                    error: errorMessage || 'Authentication failed.',
                },
                {
                    status: response.status || 400,
                },
            );
        }

        const session = mapBackendSession(result.response);
        const cookieStore = await cookies();

        cookieStore.set(AUTH_COOKIE_NAME, encodeAuthSession(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unable to complete sign in.',
            },
            {
                status: 500,
            },
        );
    }
}
