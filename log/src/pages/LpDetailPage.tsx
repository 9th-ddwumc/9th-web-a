import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import useGetInfiniteComments from '../hooks/queries/useGetInfiniteComments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import { Loading, ErrorDisplay, EmptyState } from '../component/LoadingError';
import { CommentSkeletonList } from '../component/skeletonUi';

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
    const [newComment, setNewComment] = useState('');
    const observerTarget = useRef<HTMLDivElement>(null);

    // LP 상세 정보
    const { data, isPending, isError, error, refetch } = useGetLpDetail(lpid);

    // ✅ 댓글 무한 스크롤
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchComments,
    } = useGetInfiniteComments(lpid, commentOrder);

    const queryClient = useQueryClient();

    // ✅ 댓글 작성 Mutation
    const createCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            const { data } = await axiosInstance.post(`/v1/lps/${lpid}/comments`, {
                content,
            });
            return data;
        },
        onSuccess: () => {
            setNewComment('');
            // 댓글 목록 새로고침
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
            refetchComments();
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
        },
    });

    // ✅ 댓글 무한 스크롤 Intersection Observer
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

    // 비로그인 상태 체크
    if (!accessToken) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 text-white">로그인 필요</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        로그인이 필요한 서비스입니다. 로그인을 해주세요!
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { from: `/lp/${lpid}` } })}
                        className="w-full px-6 py-3 bg-cyan-400 text-black font-medium rounded hover:bg-cyan-300 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        );
    }

    if (isPending) return <Loading message="LP를 불러오는 중..." />;
    if (isError) return <ErrorDisplay message="LP를 불러오는데 실패했습니다." error={error} onRetry={refetch} />;
    if (!data) return <EmptyState message="LP를 찾을 수 없습니다." onAction={() => navigate('/')} actionText="홈으로 돌아가기" />;

    const handleEdit = () => console.log('수정 클릭');
    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            console.log('삭제 클릭');
        }
    };
    const handleLike = () => console.log('좋아요 클릭');

    // ✅ 댓글 작성 핸들러
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim().length < 1) {
            alert('댓글을 입력해주세요.');
            return;
        }
        createCommentMutation.mutate(newComment);
    };

    // ✅ 모든 댓글 평탄화
    const allComments = commentsData?.pages.flatMap(page => page.data) || [];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* ========== 작성자 정보 섹션 ========== */}
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
                            {data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            }) : '날짜 정보 없음'}
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== 제목 + 액션 버튼 ========== */}
            <section className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-bold text-white flex-1">{data.title || '제목 없음'}</h1>
                    <div className="flex gap-2">
                        <button onClick={handleEdit} className="p-2 hover:bg-gray-800 rounded transition-colors" title="수정">✏️</button>
                        <button onClick={handleDelete} className="p-2 hover:bg-gray-800 rounded transition-colors" title="삭제">🗑️</button>
                    </div>
                </div>
            </section>

            {/* ========== 썸네일 ========== */}
            <section className="mb-8">
                <div className="aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
                    <img
                        src={data.thumbnail || 'https://via.placeholder.com/600'}
                        alt={data.title}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=No+Image'; }}
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* ========== 본문 ========== */}
            <section className="mb-8">
                <div className="bg-gray-900 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                        {data.content || '내용이 없습니다.'}
                    </p>
                </div>
            </section>

            {/* ========== 태그 ========== */}
            {data.tags && data.tags.length > 0 && (
                <section className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (
                            <span key={tag.id} className="px-4 py-1.5 bg-gray-800 text-blue-400 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ========== 좋아요 ========== */}
            <section className="border-t border-gray-800 pt-8 mb-12">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={handleLike} className="flex items-center gap-3 px-8 py-3 bg-gray-800 hover:bg-pink-600 rounded-full transition-colors group">
                        <span className="text-3xl group-hover:scale-110 transition-transform">❤️</span>
                        <span className="text-2xl font-semibold text-white">{data.likes?.length || 0}</span>
                    </button>
                </div>
            </section>

            {/* ========== 댓글 섹션 ========== */}
            <section className="border-t border-gray-800 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">댓글 {allComments.length}</h2>
                    
                    {/* ✅ 댓글 정렬 버튼 */}
                    <div className="inline-flex rounded-lg overflow-hidden">
                        <button 
                            onClick={() => setCommentOrder('desc')} 
                            className={`px-4 py-1.5 text-sm transition-colors ${
                                commentOrder === 'desc' ? 'bg-white text-black font-medium' : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            최신순
                        </button>
                        <button 
                            onClick={() => setCommentOrder('asc')} 
                            className={`px-4 py-1.5 text-sm transition-colors ${
                                commentOrder === 'asc' ? 'bg-white text-black font-medium' : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            오래된순
                        </button>
                    </div>
                </div>

                {/* ✅ 댓글 작성란 */}
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
                                className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                {createCommentMutation.isPending ? '작성 중...' : '작성'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* ✅ 댓글 목록 */}
                <div className="space-y-4">
                    {isCommentsLoading ? (
                        <CommentSkeletonList count={5} />
                    ) : allComments.length > 0 ? (
                        <>
                            {allComments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-3 p-4 bg-gray-900 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {comment.author?.avatar ? (
                                            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>👤</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white mb-1">{comment.author?.name || '익명'}</p>
                                        <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleString('ko-KR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            
                            {isFetchingNextPage && <CommentSkeletonList count={3} />}
                            
                            <div ref={observerTarget} className="h-4" />
                            
                            {!hasNextPage && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    모든 댓글을 불러왔습니다.
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            첫 댓글을 작성해보세요!
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LpDetailPage;