import axios, { type AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const postTokenReissue = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
    refresh: refreshToken 
  });
  return response.data.data; 
};


apiClient.interceptors.request.use(
  (config) => {
    const storedToken = window.localStorage.getItem('accessToken');
    if (storedToken) {
      const token = JSON.parse(storedToken);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      
      const refreshToken = JSON.parse(window.localStorage.getItem('refreshToken') || 'null');
      
      if (refreshToken) {
        try {
          // 수정된 postTokenReissue 함수 호출
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await postTokenReissue(refreshToken);

          // 두 개의 토큰을 모두 갱신
          window.localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
          window.localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken)); 
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return apiClient(originalRequest);

        } catch (reissueError) {
          console.error("RefreshToken is expired, logging out.");
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('refreshToken');
          window.location.href = '/login'; 
          return Promise.reject(reissueError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);