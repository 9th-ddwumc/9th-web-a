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
import {
  postLogin,
  postLogout,
  type LoginForm,
  getUserInfo, 
} from '../api/auth';
import { apiClient } from '../api/apiClient';
import type { User } from '../api/types';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (loginData: LoginForm) => Promise<boolean>;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    'accessToken',
    null,
  );
  const [refreshToken, setRefreshToken, removeRefreshToken] =
    useLocalStorage<string | null>('refreshToken', null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserOnLoad = async (token: string) => {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await getUserInfo();
        setUser(response.data.data); 
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      
        if ((error as any).response?.status !== 401) {
          logout();
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
  }, [accessToken]); 

  const login = async (loginData: LoginForm): Promise<boolean> => {
    try {
      const { accessToken, refreshToken, id, name } = await postLogin(loginData);

      if (accessToken && refreshToken) {
       
        setUser({
          id,
          name,
          email: '', 
          bio: null,
          avatar: null,
          createdAt: '',
          updatedAt: '',
        });
        setAccessToken(accessToken);
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
      if (accessToken) {
        await postLogout();
      }
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      setAccessToken(null);
      removeRefreshToken();
      setUser(null);
    }
  };

  const value = {
    accessToken,
    refreshToken,
    user,
    setUser,
    login,
    logout,
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