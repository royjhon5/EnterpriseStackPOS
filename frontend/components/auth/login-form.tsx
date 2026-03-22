'use client';

import { AUTH_REDIRECT_QUERY_KEY, DEFAULT_AUTHENTICATED_PATH } from '@/lib/auth/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const redirectTo = useMemo(() => searchParams.get(AUTH_REDIRECT_QUERY_KEY) || DEFAULT_AUTHENTICATED_PATH, [searchParams]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const payload = (await response.json()) as { error?: string };

            if (!response.ok) {
                setErrorMessage(payload.error || 'Unable to sign in with the provided credentials.');
                return;
            }

            router.replace(redirectTo);
            router.refresh();
        } catch {
            setErrorMessage('A network error occurred while signing in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white-light/20 bg-white/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-[#1b2e4b] dark:bg-[#0e1726]">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">StackPOS</p>
                <h1 className="mt-3 text-3xl font-extrabold text-[#3b3f5c] dark:text-white">Welcome back</h1>
                <p className="mt-2 text-sm text-[#888ea8] dark:text-white-dark/70">Sign in with your staff account to access your POS workspace securely.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#3b3f5c] dark:text-white" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className="form-input h-12"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#3b3f5c] dark:text-white" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="form-input h-12"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                {errorMessage ? <div className="rounded-lg border border-danger/30 bg-danger-light p-3 text-sm text-danger">{errorMessage}</div> : null}

                <button type="submit" className="btn btn-primary !mt-6 h-12 w-full text-base" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in securely'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
