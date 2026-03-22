import axios from 'axios';

export const api = axios.create({
    baseURL: '/api/proxy',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status === 401 && typeof window !== 'undefined') {
            window.location.href = '/login';
        }

        return Promise.reject(error);
    },
);
