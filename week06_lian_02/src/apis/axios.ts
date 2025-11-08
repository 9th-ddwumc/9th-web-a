import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; //요청 재시도 여부 나타내는 플래그
}

let refreshPromise: Promise<string> | null = null;

// 기본 서버 주소 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 토큰을 자동으로 헤더에 포함
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
  },
  (error) => Promise.reject(error),
);

// 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 두고
  async(error) => {       // 에러 발생 시 처리
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러 감지 및 재시도 방지
    if (
      error.response &&
      error.response.status === 401 && // 인증 실패
      !originalRequest._retry          // 재시도 중이 아닐 때
    ) {
      // Refresh Token API 실패 시 로그아웃
      if (originalRequest.url === '/vl/auth/refresh') {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      // Refresh Token 갱신 요청 자체가 401이면 완전히 인증 만료
      // -> 저장된 토큰 모두 삭제하고 로그인 페이지로 이동

      originalRequest._retry = true; // 무한 루프 방지 플래그

      if (!refreshPromise) {
        refreshPromise = (async() => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          const refreshToken = getRefreshToken();

          // Refresh Token으로 새 토큰 발급
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
            const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          // 새 토큰 저장
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          return data.data.accessToken; // 새 Access Token 반환
        })().catch((error) => { // Refresh Token도 유효하지 않음
          const { removeItem: removeAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
          const { removeItem: removeRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          removeAccessToken();
          removeRefreshToken();
        })
        .finally(() => {
          refreshPromise = null; // 완료 후 초기화
        });
      }
      return refreshPromise.then((newAccessToken) => {
        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }
    return Promise.reject(error);
  },
)