// src/components/LpDetailModal.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetLpById } from '../hooks/useGetLpById';
import { useAuth } from '../contexts/AuthContext';
import { useDeleteLp } from '../hooks/useDeleteLp';
import React, { useState, useEffect } from 'react';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { useInView } from 'react-intersection-observer';
import { useGetLpComments } from '../hooks/useGetLpComments';
import type { SortOrder } from '../api/lps';
import { useCreateLpComment } from '../hooks/useCreateLpComment';
import { useDeleteLpComment } from '../hooks/useDeleteLpComment';
import { useUpdateLpComment } from '../hooks/useUpdateLpComment';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Comment, CommentListResponse } from '../api/types';
import LpEditModal from './LpEditModal';

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
interface CommentItemProps {
  comment: Comment;
  lpid: string;
}
function CommentItem({ comment, lpid }: CommentItemProps) {
  const { user } = useAuth();
  const deleteCommentMutation = useDeleteLpComment(lpid);
  const updateCommentMutation = useUpdateLpComment(lpid);

  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue } = useForm<{ content: string }>({
    defaultValues: { content: comment.content },
  });

  const isMyComment = user?.id === comment.author.id;

  const handleDelete = () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(comment.id);
    }
  };
  const handleUpdate: SubmitHandler<{ content: string }> = (data) => {
    updateCommentMutation.mutate(
      { commentId: comment.id, content: data.content },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setValue('content', comment.content);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #333',
      }}
    >
      <img
        src={comment.author.avatar || 'https://via.placeholder.com/40'}
        alt={comment.author.name}
        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
            {comment.author.name}
          </span>
          <span style={{ fontSize: '12px', color: '#aaa' }}>
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit(handleUpdate)} style={{ marginTop: '8px' }}>
            <input
              {...register('content', { required: true })}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#111',
                border: '1px solid #555',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                textAlign: 'right',
                marginTop: '8px',
                display: 'flex',
                gap: '5px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={cancelEdit}
                disabled={updateCommentMutation.isPending}
                style={commentButtonStyle}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateCommentMutation.isPending}
                style={{ ...commentButtonStyle, ...commentConfirmButtonStyle }}
              >
                {updateCommentMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '14px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {comment.content}
            </p>
            {isMyComment && (
              <div
                style={{
                  textAlign: 'right',
                  marginTop: '5px',
                  display: 'flex',
                  gap: '5px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  style={commentActionStyle}
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                  style={commentActionStyle}
                >
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
const commentActionStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#aaa',
  fontSize: '12px',
  cursor: 'pointer',
  padding: '4px',
};
const commentButtonStyle: React.CSSProperties = {
  background: '#444',
  border: 'none',
  color: 'white',
  fontSize: '12px',
  cursor: 'pointer',
  padding: '6px 10px',
  borderRadius: '4px',
};
const commentConfirmButtonStyle: React.CSSProperties = {
  background: '#FF4B8C',
};
function CommentSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #333',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#333',
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: '16px',
            width: '30%',
            background: '#333',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        />
        <div
          style={{
            height: '14px',
            width: '80%',
            background: '#222',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}
type CommentFormValues = { content: string };
function CommentForm({ lpid }: { lpid: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();
  const { register, handleSubmit, reset } = useForm<CommentFormValues>();
  const createCommentMutation = useCreateLpComment(lpid);
  const onSubmit: SubmitHandler<CommentFormValues> = (data) => {
    if (!accessToken) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      navigate('/login', { state: { from: location } });
      return;
    }
    createCommentMutation.mutate(data.content, {
      onSuccess: () => {
        reset();
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', gap: '10px', margin: '20px 0' }}
    >
      <input
        {...register('content', { required: true })}
        placeholder={
          accessToken ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'
        }
        disabled={!accessToken}
        style={{
          flex: 1,
          padding: '12px',
          backgroundColor: '#222',
          border: '1px solid #444',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
        }}
      />
      <button
        type="submit"
        disabled={!accessToken || createCommentMutation.isPending}
        style={{
          padding: '10px 20px',
          background: '#FF4B8C',
          border: 'none',
          color: 'white',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {createCommentMutation.isPending ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
// ---

interface LpDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lpid: string | null;
}

function LpDetailModal({ isOpen, onClose, lpid }: LpDetailModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken } = useAuth();

  const deleteMutation = useDeleteLp(onClose);

  const [isEditing, setIsEditing] = useState(false);

  const {
    data: lp,
    isPending: isLpPending,
    isError: isLpError,
    error: lpError,
    refetch: refetchLp,
  } = useGetLpById(lpid, { enabled: isOpen && !!lpid });

  const [commentOrder, setCommentOrder] = useState<SortOrder>('desc');

  const {
    data: commentData,
    isPending: isCommentsPending,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
    fetchNextPage: fetchNextCommentPage,
    hasNextPage: hasNextCommentPage,
    isFetchingNextPage: isFetchingNextCommentPage,
  } = useGetLpComments(lpid, commentOrder, { enabled: isOpen && !!lpid });

  const { ref: commentRef, inView: commentInView } = useInView({
    threshold: 0,
    root: document.getElementById('lp-detail-modal-content'),
  });

  useEffect(() => {
    if (commentInView && hasNextCommentPage && !isFetchingNextCommentPage) {
      fetchNextCommentPage();
    }
  }, [
    commentInView,
    hasNextCommentPage,
    isFetchingNextCommentPage,
    fetchNextCommentPage,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const toggleCommentSort = () => {
    setCommentOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const checkAuthAndExecute = (action: () => void) => {
    if (!accessToken) {
      alert('로그인이 필요한 페이지입니다.');
      onClose();
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
      setIsEditing(true);
    });
  };

  const handleLike = () => {
    checkAuthAndExecute(() => {
      alert('좋아요 기능은 미션 2에서 구현합니다.');
    });
  };

  const renderComments = () => {
    if (isCommentsPending) {
      return Array.from({ length: 5 }).map((_, i) => (
        <CommentSkeleton key={i} />
      ));
    }
    if (isCommentsError) {
      return (
        <ErrorDisplay
          message={commentsError.message}
          onRetry={() => refetchComments()}
        />
      );
    }

    // [오류 수정] 'page' 파라미터에 'CommentListResponse' 타입 명시
    const comments =
      commentData?.pages.flatMap((page: CommentListResponse) => page.data.data) ||
      [];

    if (comments.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          첫 댓글을 작성해보세요.
        </div>
      );
    }

    // [오류 수정] 'comment' 파라미터에 'Comment' 타입 명시
    return comments.map((comment: Comment) => (
      <CommentItem key={comment.id} comment={comment} lpid={lpid!} />
    ));
  };

  if (!isOpen || !lpid) {
    return null;
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div
        id="lp-detail-modal-content"
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={modalCloseButtonStyle}>
          X
        </button>

        {isLpPending ? (
          <DetailSkeleton />
        ) : isLpError ? (
          <ErrorDisplay message={lpError.message} onRetry={() => refetchLp()} />
        ) : lp ? (
          <>
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div>
                <h1 style={{ margin: 0, fontSize: '28px' }}>{lp.title}</h1>
                <p style={{ margin: '8px 0 0', color: '#aaa' }}>
                  작성자: {lp.author?.name || '정보 없음'}
                  <span style={{ marginLeft: '10px', fontSize: '14px' }}>
                    {`(${formatRelativeTime(lp.createdAt)})`}
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexShrink: 0,
                  alignItems: 'center',
                }}
              >
                {user && user.id === lp.authorId && (
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
                src={lp.thumbnail}
                alt={lp.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              />
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {lp.content}
              </p>
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
                {lp.tags.map((tag) => (
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
                  background: '#FF4B8C',
                  border: 'none',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ❤️ {lp.likes.length || 0}
              </button>
            </footer>

            <section
              style={{
                marginTop: '40px',
                borderTop: '1px solid #444',
                paddingTop: '20px',
              }}
            >
              <h3 style={{ margin: 0 }}>댓글</h3>
              <CommentForm lpid={lpid} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px',
                }}
              >
                <button
                  onClick={toggleCommentSort}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: commentOrder === 'desc' ? 'white' : '#888',
                    cursor: 'pointer',
                    padding: '5px',
                  }}
                >
                  최신순
                </button>
                <button
                  onClick={toggleCommentSort}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: commentOrder === 'asc' ? 'white' : '#888',
                    cursor: 'pointer',
                    padding: '5px',
                  }}
                >
                  오래된순
                </button>
              </div>
              <div>{renderComments()}</div>
              {isFetchingNextCommentPage && <CommentSkeleton />}
              <div ref={commentRef} style={{ height: '50px', width: '100%' }} />
            </section>
          </>
        ) : null}

        {lpid && (
          <LpEditModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            lpid={lpid}
          />
        )}
      </div>
    </div>
  );
}

// ... (Modal styles)
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  position: 'relative',
  background: '#1a1a1a',
  padding: '30px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  color: 'white',
  border: '1px solid #333',
  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)',
};

const modalCloseButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'transparent',
  border: 'none',
  color: '#aaa',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '5px',
  lineHeight: '1',
};

export default LpDetailModal;