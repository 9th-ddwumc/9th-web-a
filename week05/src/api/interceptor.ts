// src/api/interceptor.ts


// 🚨 useLocalStorage 훅의 반환 값에 따라 함수명이 달라집니다.
// useLocalStorage는 보통 [storedValue, setValue, removeValue] 배열을 반환합니다.
// 여기서는 별도의 파일에서 useLocalStorage를 사용해 토큰 관리 함수를 전역적으로 가져온다고 가정합니다.
import { 
    getAccessToken, getRefreshToken, 
    setAccessTokenInStorage, setRefreshTokenInStorage, 
    removeAccessToken, removeRefreshToken 
} from './tokenManager'; // (별도 파일에서 토큰 관리 함수를 가져온다고 가정)


// 1. 커스텀 요청 설정 타입 정의 [00:13:07]
// 요청 제시도 여부를 나타내는 플래그 (무한 루프 방지)
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; 
}

// 2. Refresh Token 요청 중복 방지 변수 선언 [00:15:31]
// Promise를 저장하여 여러 요청이 동시에 401 에러를 받았을 때, 
// 토큰 갱신 요청은 한 번만 하도록 관리합니다.
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 3. Axios 인스턴스 생성 및 기본 설정 [00:15:51]
// BASE_URL은 실제 백엔드 주소로 설정해야 합니다.
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    timeout: 5000, 
});

// 4. 요청 인터셉터 (Request Interceptor) - Access Token 추가 [00:16:08]
axiosInstance.interceptors.request.use(
    (config: CustomInternalAxiosRequestConfig) => {
        const accessToken = getAccessToken(); // 로컬 스토리지에서 Access Token 가져오기 [00:16:32]

        if (accessToken) {
            // Access Token이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가 [00:17:10]
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // 수정된 요청 설정을 반환합니다. [00:17:39]
        return config;
    },
    (error: AxiosError) => {
        // 요청 인터셉터가 실패하면 에러를 반환합니다. [00:17:58]
        return Promise.reject(error);
    }
);

// 5. 응답 인터셉터 (Response Interceptor) - 401 에러 처리 및 토큰 갱신 [00:18:20]
axiosInstance.interceptors.response.use(
    (response) => {
        // 정상 응답은 그대로 반환합니다. [00:19:03]
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;
        
        // 5-1. 401 에러 및 재시도 플래그 확인 [00:19:38]
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // 5-2. Refresh Endpoint 에러 처리 (로그아웃 처리) [00:20:20]
            // Refresh API 요청에서도 401 에러가 발생했다면, Refresh Token 자체가 만료되었거나 문제가 있는 경우입니다.
            if (originalRequest.url === '/v1/auth/refresh') {
                removeAccessToken();
                removeRefreshToken();
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트 [00:21:41]
                return Promise.reject(error); // 에러 반환
            }
            
            originalRequest._retry = true; // 요청 제시도 플래그를 true로 설정 [00:21:55]
            
            // 5-3. 토큰 갱신 요청 중복 처리 [00:22:50]
            if (isRefreshing) {
                // 이미 갱신 요청이 진행 중이면, 프로미스에 저장했다가 새 토큰이 오면 재실행합니다. [00:23:00]
                return new Promise(resolve => {
                    refreshSubscribers.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            // 5-4. 토큰 갱신 로직 실행 (최초 401 발생 시) [00:23:12]
            isRefreshing = true;
            
            try {
                const refreshToken = getRefreshToken(); // Refresh Token 가져오기 [00:24:06]

                // 🚨 Refresh Token API 호출 (스웨거 문서 기준) [00:24:15]
                const res = await axiosInstance.post('/v1/auth/refresh', { 
                    refreshToken: refreshToken 
                });
                
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
                
                // 로컬 스토리지에 새 토큰 저장 [00:25:20]
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);
                
                // isRefreshing 플래그 초기화
                isRefreshing = false; 

                // 대기 중이던 요청들에게 새 토큰 전달 후 재시도 [00:28:18]
                refreshSubscribers.forEach(callback => callback(newAccessToken));
                refreshSubscribers = [];

                // 원본 요청의 헤더를 갱신하고 재시도 [00:28:35]
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); 
                
            } catch (refreshError) {
                // Refresh 요청 실패 시 (토큰 갱신 실패) [00:27:01]
                removeAccessToken();
                removeRefreshToken();
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        
        // 401 에러가 아닌 경우나 이미 재시도한 요청인 경우 그대로 오류 반환 [00:29:34]
        return Promise.reject(error);
    }
);

export default axiosInstance;