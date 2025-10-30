import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { postLogin, postLogout } from '../api/auth';
import { z } from 'zod';

// Zod 
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginForm = z.infer<typeof loginSchema>;

// Context 타입에 refreshToken 추가
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null; // RefreshToken 상태 추가
  login: (loginData: LoginForm) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
  // refreshToken을 localStorage에서 관리
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);

  const login = async (loginData: LoginForm): Promise<boolean> => {
    try {
      const data = await postLogin(loginData);
      
      // 두 개의 토큰을 모두 저장
      if (data.accessToken && data.refreshToken) { 
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken); //  refreshToken 저장
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
      // 두 개의 토큰 모두 삭제
      removeAccessToken();
      removeRefreshToken(); // 6. refreshToken 삭제
    }
  };

  // Provider value에 refreshToken 전달
  const value = { accessToken, refreshToken, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}