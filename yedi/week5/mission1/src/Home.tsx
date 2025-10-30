import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // 1. useAuth 임포트

function Home() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth(); // 2. 토큰 상태와 로그아웃 함수 가져오기

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      {/* 상단 헤더 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 onClick={() => navigate('/')} style={{ color: '#FF4B8C', fontSize: '20px', margin: 0, fontWeight: 'bold', cursor: 'pointer' }}>
          돌려돌려 LP판
        </h1>

        {/* 3. 로그인 상태에 따라 버튼 분기 처리 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {accessToken ? (
            // 로그인 상태일 때
            <>
              <button
                onClick={() => navigate('/my-page')}
                style={{ padding: '8px 16px', backgroundColor: '#FF4B8C', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #666', borderRadius: '4px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            // 로그아웃 상태일 때
            <>
              <button
                onClick={() => navigate('/login')}
                style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #666', borderRadius: '4px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{ padding: '8px 16px', backgroundColor: '#FF4B8C', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '36px', margin: 0 }}>
          WELCOME !
        </h2>
        <p style={{ color: '#888', fontSize: '18px' }}>
          돌려돌려 LP판에 오신 것을 환영합니다.
        </p>
      </div>
    </div>
  );
}

export default Home;