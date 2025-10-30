import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate"; 
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // 이미 로그인된 경우 /my로 리다이렉트
    useEffect(() => {
        console.log('Current accessToken:', accessToken);
        if (accessToken) {
            console.log('Redirecting to /my');
            navigate('/my', { replace: true });
        }
    }, [accessToken, navigate]);   
     
    const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            console.log('Submitting login...');
            await login(values);
            console.log('Login successful, navigating to /my');
            // login이 성공하면 accessToken이 업데이트되고
            // useEffect가 자동으로 /my로 이동시킴
        } catch (error) {
            console.error('Login failed:', error);
            // 에러 메시지는 AuthContext에서 alert로 표시됨
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + 'v1/auth/google/login';
    }
    const isDisabled = 
        isLoading ||
        Object.values(errors).some((error) => error.length > 0) || 
        Object.values(values).some((value) => value === ''); 

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 뒤로 가기 버튼 */}
            <div className="p-4">
                <button 
                    onClick={handleGoBack}
                    className="text-2xl text-gray-700 hover:text-gray-900 transition-colors "
                    aria-label="뒤로 가기"
                >
                    &lt;
                </button>
            </div>
            
            {/* 로그인 폼 */}
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div className="flex flex-col gap-3 w-[300px]">
                    <input 
                        {...getInputProps('email')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.email && touched?.email ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                        type="email"
                        placeholder="이메일"
                        disabled={isLoading}
                    />
                    {errors?.email && touched?.email && (
                        <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                    
                    <input 
                        {...getInputProps('password')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.password && touched?.password ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
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
                        //disabled={isDisabled}
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                        <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        //disabled={isDisabled}
                        // disabled일 때 배경: gray-300, 커서: not-allowed 적용
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer 
                                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-center gap-4">
                            {/* isDisabled가 true일 때 이미지에 grayscale 및 opacity 적용 */}
                            <div className={`transition-all duration-200 ${isDisabled ? 'grayscale opacity-50' : ''}`}>
                                <img 
                                    src="/images/google.png" // 실제 Google 로고 이미지 경로
                                    alt="Google logo"
                                    className="w-6 h-6" // 이미지 크기는 필요에 따라 조정하세요.
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