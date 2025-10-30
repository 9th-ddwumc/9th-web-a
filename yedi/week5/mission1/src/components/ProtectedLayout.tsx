import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedLayout() {
  const { accessToken } = useAuth(); // 1. 전역 상태에서 토큰 가져오기

  // 2. 토큰이 없으면(로그인 안했으면) /login으로 리다이렉트
  if (!accessToken) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" replace />; 
    // replace: 히스토리에 남기지 않아 뒤로가기 방지
  }

  // 3. 토큰이 있으면 자식 페이지(Outlet) 렌더링
  return <Outlet />;
}

export default ProtectedLayout;