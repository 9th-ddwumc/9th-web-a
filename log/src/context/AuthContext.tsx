// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { postSignin, postLogout } from "../apis/auth";
import type { ResponseSigninDto, RequestSigninDto } from "../types/auth"; 
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login(signinData: RequestSigninDto): Promise<void>;
    logout(): Promise<void>;
    setTokens(accessToken: string, refreshToken: string): void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
    setTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { getItem: getAccessToken, setItem: setAccessToken, removeItem: removeAccessToken } = 
        useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { getItem: getRefreshToken, setItem: setRefreshToken, removeItem: removeRefreshToken } = 
        useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessTokenState] = useState<string | null>(() => {
        const token = getAccessToken(null);
        if (!token || token === 'undefined' || token === 'null') {
            removeAccessToken();
            return null;
        }
        return token;
    });
    
    const [refreshToken, setRefreshTokenState] = useState<string | null>(() => {
        const token = getRefreshToken(null);
        if (!token || token === 'undefined' || token === 'null') {
            removeRefreshToken();
            return null;
        }
        return token;
    });

    // localStorage 변경 감지 (구글 로그인용)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === LOCAL_STORAGE_KEY.accessToken) {
                const newToken = e.newValue;
                if (newToken && newToken !== 'undefined' && newToken !== 'null') {
                    setAccessTokenState(newToken);
                } else {
                    setAccessTokenState(null);
                }
            }
            if (e.key === LOCAL_STORAGE_KEY.refreshToken) {
                const newToken = e.newValue;
                if (newToken && newToken !== 'undefined' && newToken !== 'null') {
                    setRefreshTokenState(newToken);
                } else {
                    setRefreshTokenState(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // 초기화 시 잘못된 토큰 정리
    useEffect(() => {
        const cleanupInvalidTokens = () => {
            const accessTokenValue = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
            const refreshTokenValue = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            
            if (accessTokenValue === 'undefined' || accessTokenValue === 'null') {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                setAccessTokenState(null);
            } else if (accessTokenValue) {
                setAccessTokenState(accessTokenValue);
            }
            
            if (refreshTokenValue === 'undefined' || refreshTokenValue === 'null') {
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                setRefreshTokenState(null);
            } else if (refreshTokenValue) {
                setRefreshTokenState(refreshTokenValue);
            }
        };
        
        cleanupInvalidTokens();
    }, []);

    // 토큰 직접 설정 함수 (구글 로그인용)
    const setTokens = (newAccessToken: string, newRefreshToken: string) => {
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setAccessTokenState(newAccessToken);
        setRefreshTokenState(newRefreshToken);
    };

    // ✅ 로그인 함수 - 동기적으로 state 업데이트 보장
    const login = async (signinData: RequestSigninDto) => {
        try {
            const response: ResponseSigninDto = await postSignin(signinData);
            
            console.log('Login response:', response);
            
            const newAccessToken = response.accessToken || response.data?.accessToken;
            const newRefreshToken = response.refreshToken || response.data?.refreshToken;
            
            if (!newAccessToken || !newRefreshToken) {
                throw new Error('토큰이 응답에 포함되지 않았습니다.');
            }

            // ✅ localStorage 저장
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            
            // ✅ state 업데이트 - React가 이를 동기적으로 처리하도록 강제
            await new Promise<void>((resolve) => {
                setAccessTokenState(newAccessToken);
                setRefreshTokenState(newRefreshToken);
                // state 업데이트가 완료될 때까지 대기
                setTimeout(resolve, 0);
            });

            console.log('로그인 성공 - 토큰 저장 완료');
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        } catch (error: any) {
            if (error?.response?.status !== 404) {
                console.error('Logout error:', error);
            }
        } finally {
            removeAccessToken();
            removeRefreshToken();
            setAccessTokenState(null);
            setRefreshTokenState(null);
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, setTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};