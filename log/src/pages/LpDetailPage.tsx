// src/pages/LpDetailPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import useGetInfiniteComments from '../hooks/queries/useGetInfiniteComments';
import { useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/mutations/useCommentMutations';
import { Loading, ErrorDisplay, EmptyState } from '../component/LoadingError';
import { CommentSkeletonList } from '../component/skeletonUi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLp, postLpLike, deleteLpLike } from '../apis/lp'; // ✅ deleteLpLike 추가
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  author?: { 
    id: number;
    name: string;
    avatar?: string;
  };
}

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const [commentOrder, _setCommentOrder] = useState<'asc' | 'desc'>('desc'); // TS6133 오류 해결을 위해 setCommentOrder를 _setCommentOrder로 변경
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const { data: myInfo } = useGetMyInfo(!!accessToken);
    const myId = myInfo?.id;

    const { data, isPending, isError, error, refetch } = useGetLpDetail(lpid);
    
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfiniteComments(lpid, commentOrder);

    const createCommentMutation = useCreateComment();
    const updateCommentMutation = useUpdateComment();
    const deleteCommentMutation = useDeleteComment();
    
    const deleteLpMutation = useMutation({
        mutationFn: () => deleteLp(lpid!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            queryClient.removeQueries({ queryKey: ['lp', lpid] });
            alert('LP가 성공적으로 삭제되었습니다.');
            navigate('/', { replace: true });
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'LP 삭제에 실패했습니다.');
        },
    });

    // ✅ 좋아요 여부 확인
    const isLiked = data?.likes?.some(like => like.userId === myId);

    // ✅ 좋아요 Mutation 수정 (토글 로직 적용)
    const likeLpMutation = useMutation({
        mutationFn: async () => {
            if (isLiked) {
                return await deleteLpLike(lpid!); // 이미 좋아요 상태면 취소
            } else {
                return await postLpLike(lpid!); // 아니면 등록
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
        },
        onError: (err: any) => {
            console.error('Like error:', err);
            // 409 에러 등 발생 시에도 데이터를 갱신하여 UI 동기화
            queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
            if (err.response?.status !== 409) {
                alert(err.response?.data?.message || '좋아요 처리에 실패했습니다.');
            }
        },
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 로그인 체크 리다이렉트는 렌더링 중이 아니라 이벤트 핸들러나 useEffect에서 처리하는 것이 좋음.
    // 여기서는 그대로 유지하되, 렌더링 방식을 따름.

    if (isPending) return <Loading message="LP를 불러오는 중..." />;
    if (isError) return <ErrorDisplay message="LP를 불러오는데 실패했습니다." error={error} onRetry={refetch} />;
    if (!data) return <EmptyState message="LP를 찾을 수 없습니다." onAction={() => navigate('/')} />;

    const isAuthor = data.authorId === myId;

    const handleEdit = () => {
        if (!isAuthor) return;
        navigate(`/lp/${lpid}/edit`);
    };

    const handleDelete = () => {
        if (!isAuthor) return;
        if (window.confirm('정말 이 LP를 삭제하시겠습니까?')) {
            deleteLpMutation.mutate();
        }
    };
    
    const handleLike = () => {
        if (!accessToken) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login', { state: { from: `/lp/${lpid}` } });
            }
            return;
        }
        
        if (likeLpMutation.isPending) return;
        likeLpMutation.mutate();
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login', { state: { from: `/lp/${lpid}` } });
            }
            return;
        }
        if (newComment.trim().length < 1) {
            alert('댓글을 입력해주세요.');
            return;
        }
        createCommentMutation.mutate(
            { lpId: lpid!, content: newComment },
            {
                onSuccess: () => {
                    setNewComment('');
                },
            }
        );
    };

    const startEditing = (comment: CommentItem) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
        setOpenMenuId(null);
    };

    const handleUpdateComment = (commentId: number) => {
        if (editingContent.trim().length < 1) {
            alert('댓글을 입력해주세요.');
            return;
        }
        updateCommentMutation.mutate(
            { lpId: lpid!, commentId, content: editingContent },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditingContent('');
                },
            }
        );
    };

    const handleDeleteComment = (commentId: number) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            deleteCommentMutation.mutate({ lpId: lpid!, commentId });
            setOpenMenuId(null);
        }
    };

    const allComments = commentsData?.pages.flatMap(page => page.data) || [];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 작성자 정보 */}
            <section className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                        {data.author?.avatar ? (
                            <img src={data.author.avatar} alt={data.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-lg">👤</span>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{data.author?.name || '익명'}</p>
                        <p className="text-sm text-gray-400">
                            {data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : '날짜 정보 없음'}
                        </p>
                    </div>
                </div>
            </section>

            {/* 제목 + 버튼 */}
            <section className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-bold text-white flex-1">{data.title || '제목 없음'}</h1>
                    {isAuthor && ( 
                        <div className="flex gap-2">
                            <button 
                                onClick={handleEdit} 
                                className="p-2 hover:bg-gray-800 rounded transition-colors"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={handleDelete} 
                                disabled={deleteLpMutation.isPending}
                                className="p-2 hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
                            >
                                🗑️
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* 썸네일 */}
            <section className="mb-8">
                <div className="aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
                    <img src={data.thumbnail || 'https://via.placeholder.com/600'} alt={data.title} className="w-full h-full object-cover" />
                </div>
            </section>

            {/* 본문 */}
            <section className="mb-8">
                <div className="bg-gray-900 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg text-left">{data.content || '내용이 없습니다.'}</p>
                </div>
            </section>

            {/* 태그 */}
            {data.tags && data.tags.length > 0 && (
                <section className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (
                            <span key={tag.id} className="px-4 py-1.5 bg-gray-800 text-blue-400 rounded-full text-sm">#{tag.name}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* 좋아요 */}
            <section className="border-t border-gray-800 pt-8 mb-12">
                <div className="flex items-center justify-center">
                    <button 
                        onClick={handleLike} 
                        disabled={likeLpMutation.isPending} // 로그인 여부는 handleLike에서 체크
                        className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all disabled:opacity-50 ${
                            isLiked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                    >
                        <span className="text-3xl">{isLiked ? '💖' : '🤍'}</span> 
                        <span className="text-2xl font-semibold text-white">{data.likes?.length || 0}</span>
                    </button>
                </div>
            </section>

            {/* 댓글 작성 폼 */}
            <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">댓글 ({allComments.length})</h3>
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
                    />
                    <button 
                        type="submit"
                        disabled={createCommentMutation.isPending}
                        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-700"
                    >
                        등록
                    </button>
                </form>
            </section>

            {/* ✅ 댓글 목록 - 왼쪽 정렬 적용 */}
            <div className="space-y-4">
                {isCommentsLoading ? (
                    <CommentSkeletonList count={5} />
                ) : allComments.length > 0 ? (
                    <>
                        {allComments.map((comment: CommentItem) => (
                            <div key={comment.id} className="flex gap-3 p-4 bg-gray-900 rounded-lg items-start text-left">
                                {/* 프로필 이미지 */}
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
                                    {comment.author?.avatar ? (
                                        <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg">👤</span>
                                    )}
                                </div>
                                
                                {/* 댓글 내용 - 세로 배치 및 왼쪽 정렬 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-white text-sm">{comment.author?.name || '익명'}</p>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        
                                        {comment.author?.id === myId && editingCommentId !== comment.id && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                                                    className="text-gray-400 hover:text-white p-1"
                                                >
                                                    ⋯
                                                </button>
                                                {openMenuId === comment.id && (
                                                    <div className="absolute right-0 top-6 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                                                        <button
                                                            onClick={() => startEditing(comment)}
                                                            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg text-sm"
                                                        >
                                                            수정
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg text-sm"
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* 내용 */}
                                    {editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm border border-gray-700 focus:outline-none focus:border-pink-500"
                                                rows={3}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateComment(comment.id)}
                                                    disabled={updateCommentMutation.isPending}
                                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 disabled:bg-gray-700"
                                                >
                                                    {updateCommentMutation.isPending ? '수정 중...' : '완료'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingCommentId(null)}
                                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
                                            {comment.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isFetchingNextPage && <CommentSkeletonList count={3} />}
                        <div ref={observerTarget} className="h-4" />
                        {!hasNextPage && <div className="text-center py-4 text-gray-500 text-sm">모든 댓글을 불러왔습니다.</div>}
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">첫 댓글을 작성해보세요!</div>
                )}
            </div>
        </div>
    );
};

export default LpDetailPage;