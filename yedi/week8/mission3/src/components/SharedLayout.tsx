import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useLogout';
import LpCreateModal from './LpCreateModal';
import { useSidebar } from '../hooks/useSidebar'; 

// Home.tsx에서 useMediaQuery 훅 가져오기
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

function SharedLayout() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const logoutMutation = useLogout();
  const [isModalOpen, setIsModalOpen] = useState(false); // LP 생성 모달

  // Sidebar 로직 
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  // useSidebar 훅 사용 
  const { 
    isOpen: isSidebarOpen, 
    open: openSidebar, 
    close: closeSidebar, 
    toggle: toggleSidebar 
  } = useSidebar(isDesktop);
  
  // isDesktop 상태 변화 시 useSidebar 상태 동기화 
  useEffect(() => {
    if (isDesktop) {
        openSidebar();
    } else {
        closeSidebar();
    }
  }, [isDesktop, openSidebar, closeSidebar]); 

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        color: 'white',
        paddingTop: '70px', 
      }}
    >
      {/* 공통 헤더 (Nav-Bar)  */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#111',
          borderBottom: '1px solid #333',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {!isDesktop && (
          <button
            onClick={toggleSidebar} // <-- useSidebar.toggle 사용
            aria-label={isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
            style={{
              color: 'white',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
              zIndex: 20,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>
        )}
        {isDesktop && (
          <h1
            onClick={() => navigate('/')}
            style={{
              color: '#FF4B8C',
              fontSize: '20px',
              margin: 0,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            돌려돌려 LP판
          </h1>
        )}
        {!isDesktop && (
          <h1
            onClick={() => navigate('/')}
            style={{
              color: '#FF4B8C',
              fontSize: '20px',
              margin: 0,
              fontWeight: 'bold',
              cursor: 'pointer',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            돌려돌려 LP판
          </h1>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {accessToken ? (
            <>
              <span style={{ color: '#fff', fontSize: '14px' }}>
                {user ? `${user.name || '사용자'}님 반갑습니다.` : '로딩 중...'}
              </span>
              <button
                onClick={() => navigate('/my-page')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FF4B8C',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
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
                  cursor: 'pointer',
                }}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      {/* 공통 사이드바  */}
      {/* 배경 스크롤 방지용 오버레이: 클릭 시 closeSidebar 호출 */}
      {!isDesktop && isSidebarOpen && (
        <div
          onClick={closeSidebar} // <-- useSidebar.close 사용
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 14,
          }}
        />
      )}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: '70px',
          bottom: 0,
          width: '200px',
          backgroundColor: '#191919',
          borderRight: '1px solid #333',
          padding: '20px',
          boxSizing: 'border-box',
          zIndex: 15,
          transform: isDesktop
            ? 'translateX(0)'
            : isSidebarOpen
            ? 'translateX(0)'
            : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'white' }}>
            <li style={{ marginBottom: '10px' }}>
              <a
                href="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '16px',
                }}
              >
                탐색
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a
                href="/my-page"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '16px',
                }}
              >
                마이페이지
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 페이지 컨텐츠 */}
      <main
        style={{
          marginLeft: isDesktop ? '200px' : '0px',
          padding: '20px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <Outlet /> 
      </main>

      {/* 공통 LP 생성 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="새 LP 등록"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#FF4B8C',
          color: 'white',
          border: 'none',
          fontSize: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 10,
        }}
      >
        +
      </button>

      {/* LP 생성 모달 */}
      <LpCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default SharedLayout;