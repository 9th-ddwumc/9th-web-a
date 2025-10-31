import { createContext, useContext, type ReactNode } from 'react';
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

  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const login = async (loginData: LoginForm): Promise<boolean> => {
    try {
      const { accessToken, refreshToken } = await postLogin(loginData); 
      
      if (accessToken && refreshToken) { 
        updateAccessToken(accessToken); 
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
      updateAccessToken(null); 
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

