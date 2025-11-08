import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { useGetLpById } from '../hooks/useGetLpById';
import { useAuth } from '../contexts/AuthContext';
import { useDeleteLp } from '../hooks/useDeleteLp';
import React from 'react';
import { formatRelativeTime } from '../utils/formatRelativeTime';

function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div style={{ color: 'red', textAlign: 'center', padding: '40px 20px' }}>
      <h4>에러가 발생했습니다.</h4>
      <p>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '8px 16px',
          backgroundColor: '#FF4B8C',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        재시도
      </button>
    </div>
  );
}
function DetailSkeleton() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          height: '40px',
          width: '60%',
          backgroundColor: '#333',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
      />
      <div
        style={{
          height: '20px',
          width: '40%',
          backgroundColor: '#222',
          borderRadius: '4px',
          marginBottom: '30px',
        }}
      />
      <div
        style={{
          width: '100%',
          paddingTop: '60%', 
          backgroundColor: '#222',
          borderRadius: '12px',
          marginBottom: '30px',
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: '#222',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: '#222',
          borderRadius: '4px',
          marginBottom: '10px',
          width: '90%',
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: '#222',
          borderRadius: '4px',
          marginBottom: '30px',
          width: '70%',
        }}
      />
    </div>
  );
}

function LpDetail() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { lpid } = useParams<{ lpid: string }>();
  const { user, accessToken } = useAuth();
  const deleteMutation = useDeleteLp();

  const {
    data: lp,
    isPending,
    isError,
    error,
    refetch,
  } = useGetLpById(lpid);

  const checkAuthAndExecute = (action: () => void) => {
    if (!accessToken) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login', { state: { from: location } });
    } else {
      action();
    }
  };

  const handleDelete = () => {
    checkAuthAndExecute(() => {
      if (!lpid) return;
      if (window.confirm('정말로 이 LP를 삭제하시겠습니까?')) {
        deleteMutation.mutate(lpid);
      }
    });
  };

  const handleEdit = () => {
    checkAuthAndExecute(() => {
      navigate(`/lp/${lpid}/edit`);
    });
  };

  const handleLike = () => {
    checkAuthAndExecute(() => {
      alert('좋아요 기능은 준비 중입니다.');
    });
  };

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay message={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div
      style={{
        color: 'white',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>{lp?.title}</h1>
          <p style={{ margin: '8px 0 0', color: '#aaa' }}>
            작성자: {lp?.author?.name || '정보 없음'}
            <span style={{ marginLeft: '10px', fontSize: '14px' }}>
              {lp?.createdAt && `(${formatRelativeTime(lp.createdAt)})`}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '6px 12px',
              background: '#555',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            목록
          </button>
          {user && user.id === lp?.authorId && (
            <>
              <button
                onClick={handleEdit}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #555',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                style={{
                  padding: '6px 12px',
                  background: '#ff4444',
                  border: 'none',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </>
          )}
        </div>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <img
          src={lp?.thumbnail}
          alt={lp?.title}
          style={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        />
        <p style={{ fontSize: '16px', lineHeight: 1.6 }}>{lp?.content}</p>
      </section>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #333',
          paddingTop: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {lp?.tags.map((tag) => (
            <span
              key={tag.id}
              style={{
                background: '#333',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <button
          onClick={handleLike} 
          style={{
            padding: '8px 16px',
            background: '#454545ff',
            border: 'none',
            color: 'white',
            borderRadius: '20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ❤️ {lp?.likes.length || 0}
        </button>
      </footer>
    </div>
  );
}

export default LpDetail;