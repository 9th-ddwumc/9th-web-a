import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useGetLps } from './hooks/useGetLps';
import type { SortOrder } from './api/lps';
import type { Lp } from './api/types';
import { formatRelativeTime } from './utils/formatRelativeTime';

function LpCardSkeleton() {
  return (
    <div
      style={{
        border: '1px solid #333',
        padding: '10px',
        margin: '5px',
        background: '#222',
        height: '180px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          height: '20px',
          background: '#555',
          marginBottom: '10px',
          borderRadius: '4px',
          width: '80%',
        }}
      ></div>
      <div
        style={{
          height: '14px',
          background: '#444',
          borderRadius: '4px',
          width: '50%',
        }}
      ></div>
    </div>
  );
}
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

function LpCard({ lp }: { lp: Lp }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: '1px solid #333',
        height: '180px',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden', 
        boxShadow: isHovered ? '0 4px 12px rgba(255, 75, 140, 0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)', 
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
          zIndex: 1, 
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '16px',
            color: 'white',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {lp.title}
        </h4>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px',
          }}
        >
          <span style={{ fontSize: '12px', color: '#ccc' }}>
            {formatRelativeTime(lp.createdAt)}
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ❤️
            <span style={{ marginLeft: '4px' }}>{lp.likes.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const { accessToken, logout, user } = useAuth();
  const [sort, setSort] = useState<SortOrder>('desc');
  const { data: lps, isPending, isError, error, refetch } = useGetLps(sort);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  const toggleSort = () => {
    setSort((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const renderContent = () => {
    if (isPending) {
      return Array.from({ length: 10 }).map((_, i) => (
        <LpCardSkeleton key={i} />
      ));
    }
    if (isError) {
      return (
        <div style={{ color: 'red', gridColumn: '1 / -1', textAlign: 'center' }}>
          <h4>에러가 발생했습니다.</h4>
          <p>{error.message}</p>
          <button
            onClick={() => refetch()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF4B8C',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
          >
            재시도
          </button>
        </div>
      );
    }
    if (lps && lps.length > 0) {
      return lps.map((lp) => <LpCard key={lp.id} lp={lp} />);
    }
    if (lps && lps.length === 0) {
      return (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          게시글이 없습니다.
        </div>
      );
    }
    return null;
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
            onClick={toggleSidebar}
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
                로그아웃
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
      {!isDesktop && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
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
      <main
        style={{
          marginLeft: isDesktop ? '200px' : '0px',
          padding: '20px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>
            LP 목록
          </h2>
          <button
            onClick={toggleSort}
            style={{
              padding: '8px 12px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            정렬: {sort === 'desc' ? '최신순' : '오래된순'}
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          {renderContent()}
        </div>
      </main>
      <button
        onClick={() => navigate('/new-lp')}
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
    </div>
  );
}

export default Home;