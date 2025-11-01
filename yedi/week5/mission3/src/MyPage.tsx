import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getUserInfo } from './api/auth'; 
import { useState } from 'react';

function MyPage() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<string>(''); 

  const handleLogout = () => {
    setUserInfo(''); 
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleGetUserInfo = async () => {
    setUserInfo('로딩 중...');
    try {
      const response = await getUserInfo(); 
      const responseData = response.data.data || JSON.stringify(response.data);

      setUserInfo(`API 응답: "${responseData}" \n\n(갱신된 토큰: ${JSON.parse(localStorage.getItem('accessToken') || 'null')})`);
    } catch (error: any) {
      setUserInfo(`정보 로딩 실패: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>마이페이지 (보호된 페이지)</h1>
      <p>이 페이지는 로그인을 한 사용자만 볼 수 있습니다.</p>
      <p style={{ color: 'lime', wordBreak: 'break-all', marginBottom: '20px' }}>
        <b>현재 토큰:</b> {accessToken}
      </p>
      
      <button 
        onClick={handleGetUserInfo}
        style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}
      >
        [TEST] 보호된 정보 가져오기
      </button>

      <button 
        onClick={handleLogout}
        style={{ backgroundColor: '#FF4B8C', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
      >
        로그아웃
      </button>

      {userInfo && (
        <pre style={{ marginTop: '20px', background: '#333', padding: '10px', borderRadius: '5px', color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {userInfo}
        </pre>
      )}
    </div>
  );
}

export default MyPage;