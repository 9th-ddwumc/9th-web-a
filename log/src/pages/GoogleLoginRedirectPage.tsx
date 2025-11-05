import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Google 로그인 처리 중...');

    useEffect(() => {
        const processGoogleLogin = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const accessToken = urlParams.get('accessToken');
                const refreshToken = urlParams.get('refreshToken'); 
                
                if (!accessToken || !refreshToken) {
                    setStatus('error');
                    setMessage('로그인 정보를 받지 못했습니다.');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                    return;
                }

                // 토큰 저장
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                
                setStatus('success');
                setMessage('로그인 성공! 잠시만 기다려주세요...');
                
                // 약간의 딜레이 후 리다이렉트
                setTimeout(() => {
                    window.location.href = '/my';
                }, 1500);
                
            } catch (error) {
                console.error('Google login processing error:', error);
                setStatus('error');
                setMessage('로그인 처리 중 오류가 발생했습니다.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        };

        processGoogleLogin();
    }, [setAccessToken, setRefreshToken]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md w-full">
                <div className="flex flex-col items-center gap-6">
                    {/* 상태별 표시 */}
                    {status === 'loading' && (
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

                    {/* 메시지 */}
                    <div className="text-center">
                        <h2 className={`text-2xl font-bold mb-2 ${
                            status === 'loading' ? 'text-gray-800' :
                            status === 'success' ? 'text-green-600' :
                            'text-red-600'
                        }`}>
                            {status === 'loading' && 'Google 로그인'}
                            {status === 'success' && '로그인 완료'}
                            {status === 'error' && '로그인 실패'}
                        </h2>
                        <p className="text-gray-600">
                            {message}
                        </p>
                    </div>

                    {/* 진행 표시 */}
                    {status === 'loading' && (
                        <div className="w-full mt-4">
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full animate-pulse w-full"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleLoginRedirectPage;