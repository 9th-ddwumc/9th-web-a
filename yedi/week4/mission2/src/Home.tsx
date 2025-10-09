import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* 상단 헤더 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* 로고 */}
        <h1 style={{ 
          color: '#FF4B8C', 
          fontSize: '20px',
          margin: 0,
          fontWeight: 'bold'
        }}>
          돌려돌려 LP판
        </h1>

        {/* 로그인,회원가입 버튼 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF4B8C',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 홈 화면 */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
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