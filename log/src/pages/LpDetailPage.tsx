import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import { Loading, ErrorDisplay, EmptyState } from '../component/LoadingError';

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const { data, isPending, isError, error, refetch } = useGetLpDetail(lpid);

    // ✅ 비로그인 상태 체크
    if (!accessToken) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        로그인 필요
                    </h2>
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

    // ✅ 로딩 상태
    if (isPending) {
        return <Loading message="LP를 불러오는 중..." />;
    }

    // ✅ 에러 상태
    if (isError) {
        return (
            <ErrorDisplay 
                message="LP를 불러오는데 실패했습니다."
                error={error}
                onRetry={refetch}
            />
        );
    }

    // ✅ 데이터 없음
    if (!data) {
        return (
            <EmptyState 
                message="LP를 찾을 수 없습니다."
                onAction={() => navigate('/')}
                actionText="홈으로 돌아가기"
            />
        );
    }

    // ✅ 수정/삭제/좋아요 핸들러
    const handleEdit = () => {
        console.log('수정 클릭');
        // TODO: 수정 페이지로 이동
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            console.log('삭제 클릭');
            // TODO: 삭제 API 호출
        }
    };

    const handleLike = () => {
        console.log('좋아요 클릭');
        // TODO: 좋아요 API 호출
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* ========== 작성자 정보 섹션 ========== */}
            <section className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                        {data.author?.avatar ? (
                            <img 
                                src={data.author.avatar} 
                                alt={data.author.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-lg">👤</span>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {data.author?.name || '익명'}
                        </p>
                        <p className="text-sm text-gray-400">
                            {data.createdAt 
                                ? new Date(data.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : '날짜 정보 없음'
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== 제목 + 액션 버튼 섹션 ========== */}
            <section className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-bold text-white flex-1">
                        {data.title || '제목 없음'}
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleEdit}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                            title="수정"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                            title="삭제"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </section>

            {/* ========== 썸네일 섹션 ========== */}
            <section className="mb-8">
                <div className="aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-900 shadow-2xl">
                    <img
                        src={data.thumbnail || 'https://via.placeholder.com/600'}
                        alt={data.title}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/600?text=No+Image';
                        }}
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* ========== 본문 섹션 ========== */}
            <section className="mb-8">
                <div className="bg-gray-900 rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                        {data.content || '내용이 없습니다.'}
                    </p>
                </div>
            </section>

            {/* ========== 태그 섹션 ========== */}
            {data.tags && data.tags.length > 0 && (
                <section className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="px-4 py-1.5 bg-gray-800 text-blue-400 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ========== 좋아요 섹션 ========== */}
            <section className="border-t border-gray-800 pt-8">
                <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-3 px-8 py-3 bg-gray-800 hover:bg-pink-600 rounded-full transition-colors group"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform">❤️</span>
                        <span className="text-2xl font-semibold text-white">
                            {data.likes?.length || 0}
                        </span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LpDetailPage;