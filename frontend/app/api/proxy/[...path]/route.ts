import { getServerAuthSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function resolveBackendUrl(pathname: string, search: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
    }

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const url = new URL(pathname, normalizedBase);
    url.search = search;
    return url;
}

async function handleProxy(request: NextRequest, params: { path?: string[] }) {
    if (!ALLOWED_METHODS.includes(request.method)) {
        return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
    }

    const session = await getServerAuthSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const joinedPath = (params.path || []).join('/');
    const targetUrl = resolveBackendUrl(joinedPath, request.nextUrl.search);
    const headers = new Headers(request.headers);

    headers.set('Authorization', `Bearer ${session.token}`);
    headers.set('x-tenant-id', String(session.tenantId));
    headers.delete('host');
    headers.delete('cookie');

    const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text(),
        cache: 'no-store',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
    });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    return handleProxy(request, await context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    return handleProxy(request, await context.params);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    return handleProxy(request, await context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    return handleProxy(request, await context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
    return handleProxy(request, await context.params);
}
