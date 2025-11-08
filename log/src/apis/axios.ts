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

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
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
            if (tokenString) {
                let token = tokenString;
                try {
                    // JSON으로 저장되었을 경우 파싱
                    const parsed = JSON.parse(tokenString);
                    token = parsed;
                } catch {
                    // 파싱 실패시 그대로 사용 (문자열로 저장된 경우)
                    token = tokenString;
                }
                
                if (token && token !== 'undefined' && token !== 'null') {
                    config.headers.Authorization = `Bearer ${token}`;
                }
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

        // ✅ 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            
            // refresh 요청 자체가 실패한 경우 로그아웃
            if (originalRequest.url?.includes('/auth/refresh')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // ✅ 이미 갱신 중이면 큐에 추가
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
                const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                
                if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
                    throw new Error('No refresh token');
                }

                let parsedRefreshToken = refreshToken;
                try {
                    parsedRefreshToken = JSON.parse(refreshToken);
                } catch {
                    parsedRefreshToken = refreshToken;
                }

                // ✅ refresh 토큰으로 새 토큰 발급
                const { data } = await axiosInstance.post('/v1/auth/refresh', {
                    refreshToken: parsedRefreshToken
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
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);