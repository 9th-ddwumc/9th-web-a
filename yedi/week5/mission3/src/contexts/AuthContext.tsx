import { createContext, useContext, type ReactNode, useEffect } from 'react'; 
import { useLocalStorage } from '../hooks/useLocalStorage';
import { postLogin, postLogout, type LoginForm } from '../api/auth'; 
import { apiClient } from '../api/apiClient'; 
import { z } from 'zod';


interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null; 
  login: (loginData: LoginForm) => Promise<boolean>;
  logout: () => void;
  setAccessToken: (token: string | null) => void; 
  setRefreshToken: (token: string | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);

  // accessToken이 변경될 때마다 apiClient 헤더를 동기화하는 useEffect 추가
  useEffect(() => {
    if (accessToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [accessToken]); // accessToken이 바뀔 때마다 실행

  //  updateAccessToken 함수는 state 설정만 하도록 간소화
  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
  };

  const login = async (loginData: LoginForm): Promise<boolean> => {
    try {
      const { accessToken, refreshToken } = await postLogin(loginData); 
      
      if (accessToken && refreshToken) { 
        updateAccessToken(accessToken); // state 변경 (useEffect가 헤더 설정)
        setRefreshToken(refreshToken); 
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } finally {
      updateAccessToken(null); // state 변경 (useEffect가 헤더 삭제)
      removeRefreshToken();
    }
  };

  const value = { 
    accessToken, 
    refreshToken, 
    login, 
    logout,
    setAccessToken: updateAccessToken, 
    setRefreshToken: setRefreshToken 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}