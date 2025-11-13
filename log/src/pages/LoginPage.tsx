// src/pages/LoginPage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useLoginMutation } from "../hooks/mutations/useAuthMutations";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    
    const from = (location.state as any)?.from || '/';
    
    // ✅ useLoginMutation 호출 시 from 경로 전달 (라우팅 경로 지정)
    const loginMutation = useLoginMutation(from); 
    
    // ❌ 충돌을 일으키던 useEffect 제거: 라우팅 로직은 useLoginMutation에 위임합니다.
    /*
    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken, navigate, from]);
    */
     
    const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });

    const handleSubmit = async () => {
        // useForm의 values와 errors를 사용하여 유효성 검사 및 제출 방지
        const formErrors = validateSignin(values);
        if (Object.values(formErrors).some(error => error.length > 0)) {
            return;
        }

        if (loginMutation.isPending) return;
        
        setErrorMessage('');
        
        try {
            // ✅ useLoginMutation을 호출하여 로그인 및 성공 시 from 경로로 리다이렉션
            await loginMutation.mutateAsync(values); 
        } catch (error: any) {
            setErrorMessage(error.message || '로그인에 실패했습니다.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoogleLogin = () => {
        sessionStorage.setItem('loginRedirect', from);
        window.location.href = import.meta.env.VITE_SERVER_API_URL + 'v1/auth/google/login';
    };

    const isDisabled = 
        loginMutation.isPending ||
        Object.values(errors).some((error) => error.length > 0) || 
        Object.values(values).some((value) => value === '');

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <div className="p-4">
                <button 
                    onClick={handleGoBack}
                    className="text-2xl hover:text-pink-500 transition-colors"
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
                        disabled={loginMutation.isPending}
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
                        disabled={loginMutation.isPending}
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
                        {loginMutation.isPending ? '로그인 중...' : '로그인'}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        disabled={loginMutation.isPending}
                        className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer 
                                disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-center gap-4">
                            <div className={`transition-all duration-200 ${loginMutation.isPending ? 'grayscale opacity-50' : ''}`}>
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