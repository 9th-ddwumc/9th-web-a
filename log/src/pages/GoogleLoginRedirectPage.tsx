// src/pages/GoogleLoginRedirectPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginRedirectPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setTokens } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Google 로그인 처리 중...');

    useEffect(() => {
        const processGoogleLogin = async () => {
            try {
                // 전체 URL 로그 출력
                console.log('Current URL:', window.location.href);
                console.log('Search Params:', Object.fromEntries(searchParams.entries()));
                
                // URL 쿼리 파라미터에서 토큰 가져오기
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');
                
                console.log('Google Login Tokens:', { accessToken, refreshToken });
                
                if (!accessToken || !refreshToken) {
                    console.error('Missing tokens!');
                    setStatus('error');
                    setMessage(`로그인 정보를 받지 못했습니다. URL: ${window.location.href}`);
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 3000);
                    return;
                }

                // 토큰 저장 (AuthContext 사용)
                setTokens(accessToken, refreshToken);
                
                console.log('Tokens saved successfully');
                
                setStatus('success');
                setMessage('로그인 성공! 잠시만 기다려주세요...');
                
                // ✅ 리다이렉션 경로 처리
                const redirectPath = sessionStorage.getItem('loginRedirect') || '/';
                sessionStorage.removeItem('loginRedirect');
                
                // ✅ 1.5초 후 navigate 호출
                setTimeout(() => {
                    navigate(redirectPath, { replace: true }); 
                }, 1500);
                
            } catch (error) {
                console.error('Google login processing error:', error);
                setStatus('error');
                setMessage('로그인 처리 중 오류가 발생했습니다.');
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            }
        };

        processGoogleLogin();
    }, [searchParams, navigate, setTokens]);

    // ... (렌더링 UI 코드는 생략하지 않습니다)

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="bg-gray-900 rounded-lg shadow-lg p-12 max-w-md w-full border border-gray-800">
                <div className="flex flex-col items-center gap-6">
                    {status === 'loading' && (
                        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    )}

                    {status === 'success' && (
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}

                    <div className="text-center">
                        <h2 className={`text-2xl font-bold mb-2 ${
                            status === 'loading' ? 'text-white' :
                            status === 'success' ? 'text-green-500' :
                            'text-red-500'
                        }`}>
                            {status === 'loading' && 'Google 로그인'}
                            {status === 'success' && '로그인 완료'}
                            {status === 'error' && '로그인 실패'}
                        </h2>
                        <p className="text-gray-400">
                            {message}
                        </p>
                    </div>

                    {status === 'loading' && (
                        <div className="w-full mt-4">
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 rounded-full animate-pulse w-full"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleLoginRedirectPage;