import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getUserInfo } from '../api/auth';
import { apiClient } from '../api/apiClient';
import type { User } from '../api/types';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  // login, logout 함수는 useMutation 훅으로 대체되므로
  // AuthContext에서는 상태(토큰, 유저) 관리 및 초기 유저정보 로드만 담당
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'accessToken',
    null,
  );
  const [refreshToken, setRefreshTokenStorage, removeRefreshToken] =
    useLocalStorage<string | null>('refreshToken', null);
  const [user, setUser] = useState<User | null>(null);

  const setRefreshToken = (token: string | null) => {
    if (token === null) {
      removeRefreshToken();
    } else {
      setRefreshTokenStorage(token);
    }
  };

  useEffect(() => {
    const fetchUserOnLoad = async (token: string) => {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await getUserInfo();
        setUser(response.data.data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);

        if ((error as any).response?.status === 401) {
          // 401 에러 시 토큰을 지우고 로그아웃 상태로 만듦
          setAccessToken(null);
          removeRefreshToken();
          setUser(null);
        }
      }
    };

    if (accessToken && !user) {
      fetchUserOnLoad(accessToken);
    } else if (accessToken) {
      apiClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [accessToken, user, setAccessToken, removeRefreshToken]); 

  // login, logout 로직은 useLogin, useLogout 훅으로 이동
  // context에서는 상태와 세터만 제공

  const value = {
    accessToken,
    refreshToken,
    user,
    setUser,
    setAccessToken,
    setRefreshToken,
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