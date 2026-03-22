import { AUTH_COOKIE_NAME, AUTH_REDIRECT_QUERY_KEY, DEFAULT_AUTHENTICATED_PATH, LOGIN_PATH } from '@/lib/auth/constants';
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set([LOGIN_PATH]);

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
    const isPublicPath = PUBLIC_PATHS.has(pathname);

    if (!hasSession && !isPublicPath) {
        const loginUrl = new URL(LOGIN_PATH, request.url);
        const attemptedPath = `${pathname}${search}`;

        if (pathname !== '/') {
            loginUrl.searchParams.set(AUTH_REDIRECT_QUERY_KEY, attemptedPath);
        }

        return NextResponse.redirect(loginUrl);
    }

    if (hasSession && isPublicPath) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_PATH, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)'],
};
