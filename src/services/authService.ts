import api from '../api/axios';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
console.log("API_BASE:", API_BASE);
export const authClient = {
    register: (data: { name: string; email: string; password: string, confirmPassword: string }) =>
        axios.post('/auth/register', data, { baseURL: API_BASE }),
    login: (data: { email: string, password: string }) =>
        axios.post('/auth/login', data, { baseURL: API_BASE }),
    refresh: (refreshToken: string) =>
        api.post('/auth/refresh', { refreshToken }, { baseURL: API_BASE }),
    logout: (refreshToken: string | null) =>
        api.post('/auth/logout', { refreshToken }, { baseURL: API_BASE }),
    me: () => api.get('/auth/me'),
};
