import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign in | StackPOS',
};

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f1f5f9_0%,#e0e7ff_50%,#dbeafe_100%)] px-4 py-10 dark:bg-[linear-gradient(135deg,#060818_0%,#0e1726_55%,#1b2e4b_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_40%)]" />
            <div className="relative z-10 w-full">
                <LoginForm />
            </div>
        </div>
    );
}
