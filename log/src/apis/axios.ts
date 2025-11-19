// apis/axios.ts - Improved Version
import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL.replace(/\/$/, '');

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Helper function to safely get token from localStorage
const getToken = (key: string): string | null => {
    try {
        const tokenString = localStorage.getItem(key);
        if (!tokenString || tokenString === 'undefined' || tokenString === 'null') {
            return null;
        }
        return JSON.parse(tokenString);
    } catch (error) {
        console.error(`Error parsing token from ${key}:`, error);
        localStorage.removeItem(key);
        return null;
    }
};

// Helper function to safely set token
const setToken = (key: string, token: string): void => {
    try {
        localStorage.setItem(key, JSON.stringify(token));
    } catch (error) {
        console.error(`Error saving token to ${key}:`, error);
    }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken(LOCAL_STORAGE_KEY.accessToken);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with improved error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(new Error('네트워크 연결을 확인해주세요.'));
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('요청 시간이 초과되었습니다.'));
        }

        // Handle 401 errors (Unauthorized)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            
            // If refresh request itself failed, logout
            if (originalRequest.url?.includes('/auth/refresh')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getToken(LOCAL_STORAGE_KEY.refreshToken);
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh token
                const { data } = await axiosInstance.post('/v1/auth/refresh', {
                    refreshToken
                });

                const newAccessToken = data.data?.accessToken || data.accessToken;
                const newRefreshToken = data.data?.refreshToken || data.refreshToken;

                if (!newAccessToken) {
                    throw new Error('No access token in refresh response');
                }

                // Save new tokens
                setToken(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
                if (newRefreshToken) {
                    setToken(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);
                }

                // Trigger storage event for AuthContext
                window.dispatchEvent(new StorageEvent('storage', {
                    key: LOCAL_STORAGE_KEY.accessToken,
                    newValue: JSON.stringify(newAccessToken),
                    storageArea: localStorage
                }));

                // Process queued requests
                processQueue(null, newAccessToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh failed - logout user
                processQueue(refreshError as AxiosError, null);
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other HTTP errors
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            '알 수 없는 오류가 발생했습니다.';
        
        return Promise.reject(Object.assign(error, { 
            message: errorMessage 
        }));
    }
);