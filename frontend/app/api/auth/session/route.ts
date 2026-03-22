import { getServerAuthSession } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerAuthSession();

    if (!session) {
        return NextResponse.json({ session: null }, { status: 401 });
    }

    return NextResponse.json({ session }, { status: 200 });
}
