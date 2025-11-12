import { useNavigate, useLocation } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query"; 
// ❌ 기존: import { postSignin, type RequestSigninDto } from "../apis/auth";
// ✅ 수정: postSignin은 apis/auth에서, RequestSigninDto는 types/auth에서 가져옵니다.
import { postSignin } from "../apis/auth"; 
import type { RequestSigninDto } from "../types/auth";

const LoginPage = () => {
    // ✅ login 대신 setTokens 사용
    const { accessToken, setTokens } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    
    // 이전 페이지 경로, 없으면 홈으로
    const from = (location.state as any)?.from || '/';
    
    // 이미 로그인된 경우 리다이렉트
    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken, navigate, from]);
     
    const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });
    
    // ✅ 로그인 useMutation 구현
    const loginMutation = useMutation({
        mutationFn: (data: RequestSigninDto) => postSignin(data),
        onSuccess: (data) => {
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            if (newAccessToken && newRefreshToken) {
                setTokens(newAccessToken, newRefreshToken);
                // 로그인 성공 시 이전 페이지로 이동
                navigate(from, { replace: true });
            } else {
                setErrorMessage('로그인에 실패했습니다. (토큰 정보 부족)');
            }
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 
                           error.message || 
                           '로그인에 실패했습니다.';
            setErrorMessage(message);
        },
    });


    const handleSubmit = async () => {
        if (loginMutation.isPending) return;
        
        setErrorMessage('');
        loginMutation.mutate(values); // ✅ useMutation 실행
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoogleLogin = () => {
        sessionStorage.setItem('loginRedirect', from);
        // 서버 URL 확인
        const serverUrl = import.meta.env.VITE_SERVER_API_URL;
        console.log('Google Login URL:', `${serverUrl}v1/auth/google/login`);
        window.location.href = `${serverUrl}v1/auth/google/login`;
    };

    // ✅ isLoading 상태를 useMutation에서 가져옴
    const isLoading = loginMutation.isPending; 
    const isDisabled = 
        isLoading ||
        Object.values(errors).some((error) => error.length > 0) || 
        Object.values(values).some((value) => value === '');

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <div className="p-4">
                <button 
                    onClick={handleGoBack}
                    className="text-2xl hover:text-pink-500 transition-colors"
                    aria-label="뒤로 가기"
                >
                    &lt;
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div className="flex flex-col gap-3 w-[300px]">
                    {errorMessage && (
                        <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                            {errorMessage}
                        </div>
                    )}
                    
                    <input 
                        {...getInputProps('email')}
                        className={`border w-full p-[10px] rounded-sm bg-gray-900 text-white focus:outline-none focus:border-pink-500
                            ${errors?.email && touched?.email ? 'border-red-500 bg-red-900/20' : 'border-gray-700'}`}
                        type="email"
                        placeholder="이메일"
                        disabled={isLoading}
                    />
                    {errors?.email && touched?.email && (
                        <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                    
                    <input 
                        {...getInputProps('password')}
                        className={`border w-full p-[10px] rounded-sm bg-gray-900 text-white focus:outline-none focus:border-pink-500
                            ${errors?.password && touched?.password ? 'border-red-500 bg-red-900/20' : 'border-gray-700'}`}
                        type="password"
                        placeholder="비밀번호"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isDisabled) {
                                handleSubmit();
                            }
                        }}
                    />
                    {errors?.password && touched?.password && (
                        <div className="text-red-500 text-sm">{errors.password}</div>
                    )}
                    
                    <button 
                        type="button"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        disabled={isLoading}
                        className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer 
                                disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-center gap-4">
                            <div className={`transition-all duration-200 ${isLoading ? 'grayscale opacity-50' : ''}`}>
                                <img 
                                    src="/images/google.png"
                                    alt="Google logo"
                                    className="w-6 h-6"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <span>Google 계정으로 로그인</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;