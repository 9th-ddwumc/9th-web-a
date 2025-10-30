import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    withCredentials: true,
});

// 요청 인터셉터로 항상 최신 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const tokenString = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
            if (tokenString) {
                // JSON.parse로 파싱 시도
                let token = tokenString;
                try {
                    token = JSON.parse(tokenString);
                } catch {
                    // 파싱 실패시 그대로 사용
                    token = tokenString;
                }
                
                if (token && token !== 'undefined' && token !== 'null') {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Error setting auth token:', error);
        }
        // Removed redundant accessToken block; token is already set above.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터로 401 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (originalRequest?.url?.includes('/auth/refresh')) {
                const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                removeAccessToken();
                removeRefreshToken();
            }

            // mark that we've retried this request
            if (originalRequest) {
                originalRequest._retry = true;
            }
            
            if(!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const { getItem: getRefreshToken, removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                        const refreshToken = getRefreshToken(LOCAL_STORAGE_KEY.refreshToken);
                        const{data} = await axiosInstance.post('/auth/refresh', { refreshToken });
                        const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                        setAccessToken(data.accessToken);
                        getRefreshToken(data.refreshToken);
                        return data.accessToken;
                    } catch (error) {
                        const {removeItem: removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                        const {removeItem: removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                        removeAccessToken();
                        removeRefreshToken();
                    }finally {
                        refreshPromise = null;
                    }
                })();
            }
        }
        return refreshPromise!.then((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        });
        return Promise.reject(error);
    }
);