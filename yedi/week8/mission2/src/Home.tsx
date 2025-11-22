import React, { useState, useEffect } from 'react';
import { useGetLps } from './hooks/useGetLps';
import type { SortOrder } from './api/lps';
import type { Lp } from './api/types';
import { formatRelativeTime } from './utils/formatRelativeTime';
import { useInView } from 'react-intersection-observer';
import LpDetailModal from './components/LpDetailModal';
import { useDebounce } from './hooks/useDebounce'; 
import { useThrottle } from './hooks/useThrottle'; 

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
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div
        style={{
          height: '20px',
          background: '#444',
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

function LpCard({ lp, onClick }: { lp: Lp; onClick: (lpid: number) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(lp.id)}
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
            {' '}
            ❤️ <span style={{ marginLeft: '4px' }}>{lp.likes.length}</span>{' '}
          </span>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [sort, setSort] = useState<SortOrder>('desc');
  const [selectedLpId, setSelectedLpId] = useState<string | null>(null);
  
  //Debounce 적용 (300ms)
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLps(sort, debouncedSearchQuery);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Throttle 적용 (3000ms)
  const throttledFetchNextPage = useThrottle(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    3000, 
  );
  
  // 무한 스크롤 이벤트 처리
  useEffect(() => {
    // inView가 true가 될 때마다 throttle된 함수를 호출
    if (inView) {
      throttledFetchNextPage(); 
    }

    // 컴포넌트 언마운트 시 Throttle 타이머 정리
    return () => {
        throttledFetchNextPage.cancel(); 
    };

  }, [inView, throttledFetchNextPage]); 
  
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
        <div
          style={{ color: 'red', gridColumn: '1 / -1', textAlign: 'center' }}
        >
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

    const lps = data?.pages.flatMap((page) => page.data.data) || [];

    if (lps.length > 0) {
      return lps.map((lp) => (
        <LpCard
          key={lp.id}
          lp={lp}
          onClick={() => setSelectedLpId(String(lp.id))}
        />
      ));
    }

    if (lps.length === 0) {
      // 검색 결과가 없을 때 메시지
      return (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          {debouncedSearchQuery.trim().length > 0
            ? `'${debouncedSearchQuery}'에 대한 LP가 없습니다.`
            : '게시글이 없습니다.'}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap', 
          gap: '15px', 
        }}
      >
        <h2 style={{ color: '#fff', fontSize: '24px', margin: 0, flexShrink: 0 }}>
          LP 목록
        </h2>
        {/* 검색 입력 필드 */}
        <input
            type="text"
            placeholder="LP 제목, 내용, 태그를 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
                flexGrow: 1, 
                maxWidth: '400px',
                padding: '10px 15px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #555',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                minWidth: '200px',
            }}
        />
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
            flexShrink: 0,
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
        {isFetchingNextPage && (
          <>
            <LpCardSkeleton /> <LpCardSkeleton />
          </>
        )}
      </div>
      <div
        ref={ref}
        style={{ height: '50px', width: '100%', background: 'transparent' }}
      />

      <LpDetailModal
        isOpen={!!selectedLpId}
        lpid={selectedLpId}
        onClose={() => setSelectedLpId(null)}
      />
    </>
  );
}

export default Home;