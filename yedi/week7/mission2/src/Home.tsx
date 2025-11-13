// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { useGetLps } from './hooks/useGetLps';
import type { SortOrder } from './api/lps';
import type { Lp } from './api/types';
import { formatRelativeTime } from './utils/formatRelativeTime';
import { useInView } from 'react-intersection-observer';
import LpDetailModal from './components/LpDetailModal';

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

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLps(sort);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
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
      return (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          게시글이 없습니다.
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