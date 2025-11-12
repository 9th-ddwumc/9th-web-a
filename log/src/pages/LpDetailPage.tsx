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
import { deleteLp, postLpLike } from '../apis/lp';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  // ✅ author 속성을 선택적으로 변경하여 데이터 안정성 확보
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

    const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    // 내 정보 가져오기
    const { data: myInfo } = useGetMyInfo(!!accessToken);
    const myId = myInfo?.id; // 현재 사용자 ID (number | undefined)

    const { data, isPending, isError, error, refetch } = useGetLpDetail(lpid);
    
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfiniteComments(lpid, commentOrder);

    // 댓글/LP Mutations
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

    const likeLpMutation = useMutation({
        mutationFn: () => postLpLike(lpid!),
        
        // ✅ onMutate: 좋아요 낙관적 업데이트
        onMutate: async () => {
            // 현재 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['lp', lpid] });
            // 이전 데이터 스냅샷
            const previousLpDetail = queryClient.getQueryData(['lp', lpid]);
            
            if (previousLpDetail && myId) {
                queryClient.setQueryData(['lp', lpid], (old: any) => {
                    const isCurrentlyLiked = old.likes?.some((like: any) => like.userId === myId);
                    
                    let newLikes = [...(old.likes || [])];
                    
                    if (isCurrentlyLiked) {
                        // 좋아요 취소: 내 좋아요 객체 제거
                        newLikes = newLikes.filter(like => like.userId !== myId);
                    } else {
                        // 좋아요 추가: 가짜 좋아요 객체 추가 (임시 ID 부여)
                        newLikes = [
                            ...newLikes, 
                            { 
                                id: Date.now(), // 임시 ID
                                userId: myId, 
                                lpId: old.id 
                            }
                        ];
                    }

                    return {
                        ...old,
                        likes: newLikes, // 좋아요 배열 업데이트 (개수와 상태가 반영됨)
                    };
                });
            }

            return { previousLpDetail };
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
        },
        
        // ✅ onError: 실패 시 롤백
        onError: (err: any, variables, context) => {
            alert(err.response?.data?.message || '좋아요 처리에 실패했습니다.');
            // 롤백
            if (context?.previousLpDetail) {
                queryClient.setQueryData(['lp', lpid], context.previousLpDetail);
            }
        },
    });


    // 무한 스크롤
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

    if (!accessToken) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 text-white">로그인 필요</h2>
                    <p className="text-gray-300 mb-6">로그인이 필요한 서비스입니다.</p>
                    <button
                        onClick={() => navigate('/login', { state: { from: `/lp/${lpid}` } })}
                        className="w-full px-6 py-3 bg-pink-500 text-white font-medium rounded hover:bg-pink-600 transition-colors"
                    >
                        로그인하러 가기
                    </button>
                </div>
            </div>
        );
    }

    if (isPending) return <Loading message="LP를 불러오는 중..." />;
    if (isError) return <ErrorDisplay message="LP를 불러오는데 실패했습니다." error={error} onRetry={refetch} />;
    if (!data) return <EmptyState message="LP를 찾을 수 없습니다." onAction={() => navigate('/')} />;

    const isAuthor = data.authorId === myId;
    const isLiked = data.likes?.some(like => like.userId === myId);

    // LP 수정 페이지로 이동
    const handleEdit = () => {
        if (!isAuthor) return;
        navigate(`/lp/${lpid}/edit`);
    };

    // LP 삭제 처리
    const handleDelete = () => {
        if (!isAuthor) return;
        if (window.confirm('정말 이 LP를 삭제하시겠습니까?')) {
            deleteLpMutation.mutate();
        }
    };
    
    // LP 좋아요/좋아요 취소 처리 (토글 기능)
    const handleLike = () => {
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }
        // postLpLike API는 좋아요/취소를 모두 처리하는 것으로 가정합니다.
        likeLpMutation.mutate();
    };

    // 댓글 작성
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

    // 댓글 수정 시작
    const startEditing = (comment: CommentItem) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
        setOpenMenuId(null);
    };

    // 댓글 수정 완료
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

    // 댓글 삭제
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
                    {/* 작성자에게만 수정/삭제 버튼 표시 */}
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

            {/* 썸네일, 본문, 태그 */}
            <section className="mb-8">
                <div className="aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
                    <img src={data.thumbnail || 'https://via.placeholder.com/600'} alt={data.title} className="w-full h-full object-cover" />
                </div>
            </section>

            <section className="mb-8">
                <div className="bg-gray-900 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{data.content || '내용이 없습니다.'}</p>
                </div>
            </section>

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
                        disabled={likeLpMutation.isPending || !accessToken} 
                        className={`flex items-center gap-3 px-8 py-3 rounded-full transition-colors disabled:opacity-50 ${
                            isLiked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                    >
                        <span className="text-3xl">{isLiked ? '💖' : '🤍'}</span> 
                        <span className="text-2xl font-semibold text-white">{data.likes?.length || 0}</span>
                    </button>
                </div>
            </section>

            {/* 댓글 섹션 */}
            <section className="border-t border-gray-800 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">댓글 {allComments.length}</h2>
                    <div className="inline-flex rounded-lg overflow-hidden">
                        <button onClick={() => setCommentOrder('desc')} className={`px-4 py-1.5 text-sm ${commentOrder === 'desc' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>최신순</button>
                        <button onClick={() => setCommentOrder('asc')} className={`px-4 py-1.5 text-sm ${commentOrder === 'asc' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>오래된순</button>
                    </div>
                </div>

                {/* 댓글 작성란 */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="bg-gray-900 rounded-lg p-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full bg-transparent text-white border-none outline-none resize-none min-h-[100px]"
                            maxLength={500}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{newComment.length}/500</span>
                            <button
                                type="submit"
                                disabled={newComment.trim().length < 1 || createCommentMutation.isPending}
                                className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                {createCommentMutation.isPending ? '작성 중...' : '작성'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                    {isCommentsLoading ? (
                        <CommentSkeletonList count={5} />
                    ) : allComments.length > 0 ? (
                        <>
                            {allComments.map((comment: CommentItem) => (
                                <div key={comment.id} className="flex gap-3 p-4 bg-gray-900 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {comment.author?.avatar ? (
                                            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>👤</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium text-white">{comment.author?.name || '익명'}</p>
                                            {/* ✅ 본인 댓글만 메뉴 표시 (myId와 댓글 작성자 ID 비교) */}
                                            {comment.author?.id === myId && ( 
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        ⋯
                                                    </button>
                                                    {openMenuId === comment.id && (
                                                        <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                                                            <button
                                                                onClick={() => startEditing(comment)}
                                                                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg"
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg"
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {editingCommentId === comment.id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editingContent}
                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                    className="w-full bg-gray-800 text-white rounded p-2 text-sm"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateComment(comment.id)}
                                                        disabled={updateCommentMutation.isPending}
                                                        className="px-4 py-1 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 disabled:bg-gray-700"
                                                    >
                                                        {updateCommentMutation.isPending ? '수정 중...' : '완료'}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="px-4 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString('ko-KR')}</p>
                                            </>
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
            </section>
        </div>
    );
};

export default LpDetailPage;