import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { postLogin, postLogout } from '../api/auth'; // 1단계에서 만든 API

// Zod 타입 
import { z } from 'zod';
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
type LoginForm = z.infer<typeof loginSchema>;


// Context가 제공할 값의 타입
interface AuthContextType {
  accessToken: string | null;
  login: (loginData: LoginForm) => Promise<boolean>; // 비동기 API 호출
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. 'userData'가 아닌 'accessToken'을 로컬 스토리지에 저장/관리
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);

  // 2. 로그인 함수 (API 호출)
  const login = async (loginData: LoginForm): Promise<boolean> => {
    try {
      const data = await postLogin(loginData); // Mock API 호출
      if (data.accessToken) {
        setAccessToken(data.accessToken); // 성공 시 토큰 저장
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // 3. 로그아웃 함수
  const logout = async () => {
    try {
      await postLogout(); // 서버에 로그아웃 알림
    } finally {
      removeAccessToken(); // 클라이언트에서 토큰 삭제
    }
  };

  const value = { accessToken, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. useAuth 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}