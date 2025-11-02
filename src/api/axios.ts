import axios, { AxiosError } from 'axios';
import TokenUtils from '../utils/token';
import { authClient } from '../services/authService';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000',
    withCredentials: false, 
});

let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

api.interceptors.request.use((config) => {
    const token = accessToken;
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (val?: any) => void, reject: (err: any) => void, config: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(p => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    res => res,
    async (error: AxiosError & { config?: any }) => {
        const originalConfig = error?.config;
        if (!originalConfig) return Promise.reject(error);

        if (error?.response?.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject, config: originalConfig });
                })
                    .then((token) => {
                        originalConfig.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalConfig);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;
            const refreshToken = TokenUtils.getRefreshToken();
            if (!refreshToken) {
                isRefreshing = false;
                processQueue(new Error('No refresh token'));
                TokenUtils.clearRefreshToken();
                return Promise.reject(error);
            }

            try {
                const response = await authClient.refresh(refreshToken); 
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                setAccessToken(newAccessToken);
                if (newRefreshToken) TokenUtils.setRefreshToken(newRefreshToken);

                processQueue(null, newAccessToken);
                originalConfig.headers['Authorization'] = 'Bearer ' + newAccessToken;
                return api(originalConfig);
            } catch (err) {
                processQueue(err, null);
                TokenUtils.clearRefreshToken();
                setAccessToken(null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
