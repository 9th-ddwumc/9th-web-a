// src/layouts/ProtectedLayout.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedLayout = () => {
    const { accessToken } = useAuth(); 

    // 토큰이 없으면 로그인 페이지로 이동
    if (!accessToken) {
        // Navigate 컴포넌트 사용: replace 속성으로 히스토리에 남기지 않음
        alert('로그인이 필요한 페이지입니다.');
        return <Navigate to="/login" replace />; 
    }

    // 토큰이 있으면 자식 컴포넌트 (요청한 페이지)를 렌더링
    return <Outlet />;
};

export default ProtectedLayout;