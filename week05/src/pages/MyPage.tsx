import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function MyPage() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth(); // 토큰과 로그아웃 함수 가져오기

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>마이페이지 (보호된 페이지)</h1>
      <p>이 페이지는 로그인을 한 사용자만 볼 수 있습니다.</p>
      <p style={{ color: 'lime', wordBreak: 'break-all' }}>
        <b>발급된 토큰:</b> {accessToken}
      </p>

      <button 
        onClick={handleLogout}
        style={{ 
          backgroundColor: '#FF4B8C', 
          color: 'white', 
          marginTop: '20px', 
          border: 'none', 
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;