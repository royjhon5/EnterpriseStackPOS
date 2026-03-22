import { DEFAULT_AUTHENTICATED_PATH } from '@/lib/auth/constants';
import { getServerAuthSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import React from 'react';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerAuthSession();

    if (session) {
        redirect(DEFAULT_AUTHENTICATED_PATH);
    }

    return <div className="min-h-screen text-black dark:text-white-dark">{children}</div>;
};

export default AuthLayout;
