import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { postSignin, postLogout, type RequestSigninDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login(signinData: RequestSigninDto): Promise<void>;
    logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
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

    // 초기화 시 잘못된 토큰 정리
    useEffect(() => {
        const cleanupInvalidTokens = () => {
            const accessTokenValue = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
            const refreshTokenValue = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            
            if (accessTokenValue === 'undefined' || accessTokenValue === 'null') {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            }
            if (refreshTokenValue === 'undefined' || refreshTokenValue === 'null') {
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            }
        };
        
        cleanupInvalidTokens();
    }, []);

    const login = async (signinData: RequestSigninDto) => {
        try {
            // ✅ postSignin은 이미 response.data를 반환함
            const response = await postSignin(signinData);
            
            console.log('Login response:', response);
            
            // ✅ CommonResponse 구조 처리
            const newAccessToken = response.data?.accessToken || response.accessToken;
            const newRefreshToken = response.data?.refreshToken || response.refreshToken;
            
            if (!newAccessToken || !newRefreshToken) {
                throw new Error('토큰이 응답에 포함되지 않았습니다.');
            }

            // localStorage에 저장
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            
            // 상태 업데이트
            setAccessTokenState(newAccessToken);
            setRefreshTokenState(newRefreshToken);

            console.log('로그인 성공');
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            // ✅ alert 대신 에러를 throw하여 컴포넌트에서 처리하도록 함
            throw error;
        }
    };

    const logout = async () => {
        try {
            // 서버에 로그아웃 요청 (404 에러가 나도 계속 진행)
            await postLogout();
        } catch (error: any) {
            // 404 에러는 무시 (서버에 logout 엔드포인트가 없을 수 있음)
            if (error?.response?.status !== 404) {
                console.error('Logout error:', error);
            }
        } finally {
            // 에러 여부와 관계없이 로컬 토큰은 항상 제거
            removeAccessToken();
            removeRefreshToken();
            setAccessTokenState(null);
            setRefreshTokenState(null);
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
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