// src/pages/LoginPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    // AuthContext에서 accessToken 상태와 login 함수 가져오기
    const { accessToken, login } = useAuth(); // [00:29:40]
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 💡 로그인 상태일 경우 자동 리다이렉션 로직 ([00:48:00] 이후)
    useEffect(() => {
        if (accessToken) {
            // 토큰이 있다면 홈(/)으로 이동
            navigate('/'); // [00:49:15]
        }
    }, [accessToken, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 💡 useAuth의 login 함수를 호출하여 인증 처리 ([00:30:21])
            await login({ email, password }); 
            // 성공하면 login 함수 내부에서 마이페이지(/my)로 window.location.href 이동
            // (useAuth 내부에서는 useNavigate 사용 불가 문제로 인한 우회 [00:34:03])

        } catch (error) {
            console.error('Login error:', error);
            // login 함수에서 이미 alert 처리하지만, 명시적으로 추가 가능
        }
    };

    if (accessToken) {
        return null; // 리다이렉션 대기 중에는 아무것도 렌더링하지 않음
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="이메일"
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="비밀번호"
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginPage;