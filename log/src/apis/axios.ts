// src/apis/axios.ts
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

// VITE_SERVER_API_URL의 후행 슬래시를 제거하여 URL 구성을 안정화합니다.
const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL.replace(/\/$/, ''); // ✅ FIX: 후행 슬래시 제거

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL, // ✅ 안정화된 URL 사용
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터로 항상 최신 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const tokenString = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
            if (tokenString && tokenString !== 'undefined' && tokenString !== 'null') {
                // FIX: JSON.parse를 사용하여 따옴표가 제거된 실제 토큰 값을 가져옵니다.
                const token = JSON.parse(tokenString);
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error setting auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터로 401 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            
            // refresh 요청 자체가 실패한 경우 로그아웃
            if (originalRequest.url?.includes('/auth/refresh')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            // 이미 갱신 중이면 큐에 추가
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
                const refreshTokenString = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                
                if (!refreshTokenString || refreshTokenString === 'undefined' || refreshTokenString === 'null') {
                    throw new Error('No refresh token');
                }
                
                // FIX: JSON.parse를 사용하여 따옴표가 제거된 실제 리프레시 토큰 값을 가져옵니다.
                const refreshToken = JSON.parse(refreshTokenString);

                // refresh 토큰으로 새 토큰 발급
                const { data } = await axiosInstance.post('/v1/auth/refresh', {
                    refreshToken: refreshToken 
                });

                const newAccessToken = data.data?.accessToken || data.accessToken;
                const newRefreshToken = data.data?.refreshToken || data.refreshToken;

                if (!newAccessToken) {
                    throw new Error('No access token in refresh response');
                }

                // 새 토큰 저장
                localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccessToken));
                if (newRefreshToken) {
                    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefreshToken));
                }

                // storage 이벤트 트리거 (AuthContext가 감지하도록)
                window.dispatchEvent(new StorageEvent('storage', {
                    newValue: JSON.stringify(newAccessToken),
                    storageArea: localStorage
                }));

                // 큐에 있는 요청들 처리
                processQueue(null, newAccessToken);

                // 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // refresh 실패 시 로그아웃
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

        return Promise.reject(error);
    }
);