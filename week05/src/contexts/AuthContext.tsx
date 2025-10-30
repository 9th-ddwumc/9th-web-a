/* eslint-disable no-irregular-whitespace */
import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage"; 
import { LOCAL_STORAGE_KEY } from "../constants";
import type { RequestSigninDto } from "../types/auth";
import { postSignin, postLogout } from "../api/auth"; // postLogout 임포트 추가

// 1. 타입 정의
interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

// 2. 컨텍스트 생성 (초기값 설정)
const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

// 3. AuthProvider (Provider 컴포넌트)
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {

    // Access Token 관련 훅
    const [
        storedAccessToken, 
        setAccessTokenInStorage, // setValue (1번째 인덱스)
        removeAccessToken       // removeValue (2번째 인덱스)
    ] = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.ACCESS_TOKEN, null);

    // Refresh Token 관련 훅
    const [
        storedRefreshToken, 
        setRefreshTokenInStorage, // setValue (1번째 인덱스)
        removeRefreshToken      // removeValue (2번째 인덱스)
    ] = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.REFRESH_TOKEN, null);

    // 4. 상태 정의 및 지연 초기화 ([00:17:15])
    // 🚨 수정: useLocalStorage의 첫 번째 인덱스인 storedValue를 상태의 초기값으로 사용합니다.
    // useLocalStorage 내부에서 이미 localStorage를 읽어오므로, 여기서는 그 상태값을 사용합니다.
    const [accessToken, setAccessToken] = useState<string | null>(storedAccessToken);
    const [refreshToken, setRefreshToken] = useState<string | null>(storedRefreshToken);

    // 5. 로그인 함수 구현 ([00:20:15])
    const login = async (data: RequestSigninDto) => {
        try {
            // API 요청 (postSignIn)c
            const res = await postSignin(data);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

            // 🚨 수정: Access Token 및 Refresh Token 로컬 스토리지 및 상태 업데이트 로직 완성
            
            // 로컬 스토리지 저장
            setAccessTokenInStorage(newAccessToken); 
            setRefreshTokenInStorage(newRefreshToken);

            // 상태 업데이트
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            alert("로그인 성공");

            // 로그인 성공 후 페이지 이동 (예: 마이페이지)
            window.location.href = "/my";
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 실패");
        }
    };
    
    // 6. 로그아웃 함수 구현 ([00:23:37])
    const logout = async () => {
        try {
            await postLogout(); // API 호출

            // 로컬 스토리지 및 상태 초기화
            removeAccessToken();
            removeRefreshToken();
        
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
            // 로그아웃 후 홈으로 이동
            window.location.href = "/";
        } catch (error) {
            console.error("로그아웃 실패:", error);
            // 로그아웃 API 실패해도 로컬 상태는 지워주는 것이 일반적입니다. (이미 위에서 처리됨)
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
};