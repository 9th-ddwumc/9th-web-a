import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedLayout() {
  const { accessToken } = useAuth(); 
  const location = useLocation(); 

  if (!accessToken) {
    alert('로그인이 필요한 페이지입니다.');

    return <Navigate to="/login" state={{ from: location }} replace />; 
  }

  return <Outlet />;
}

export default ProtectedLayout;