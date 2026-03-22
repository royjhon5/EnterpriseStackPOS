import { clearAuthSession, getAuthSession } from '@/lib/auth/session';
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const session = getAuthSession();

    config.headers = config.headers ?? {};

    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }

    if (session?.tenantId) {
        config.headers['x-tenant-id'] = String(session.tenantId);
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            clearAuthSession();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);
