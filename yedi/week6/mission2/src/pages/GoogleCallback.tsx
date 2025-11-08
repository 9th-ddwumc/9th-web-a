import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setRefreshToken } = useAuth();

  const hasProcessed = useRef(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (error) {
      console.error('구글 로그인 콜백 에러:', error);
      alert(`로그인에 실패했습니다: ${error}. 로그인 페이지로 이동합니다.`);
      navigate('/login');
      return;
    }

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      console.log('구글 로그인 성공, 토큰 저장 완료');
      navigate(from, { replace: true });
    } else {
      console.error('구글 로그인 콜백 에러: 토큰이 없습니다.');
      alert('로그인에 실패했습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    }
  }, [navigate, setAccessToken, setRefreshToken, from]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: 'white',
      }}
    >
      <h1>구글 로그인 처리 중...</h1>
    </div>
  );
}

export default GoogleCallback;