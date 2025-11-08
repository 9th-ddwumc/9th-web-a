import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import { ErrorDisplay } from '../component/LoadingError';
import { LpCardSkeletonGrid } from '../component/skeletonUi';

interface LpItem {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: any[];
}

const MainPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const observerTarget = useRef<HTMLDivElement>(null);
    
    // ✅ URL에서 검색어 가져오기
    const urlSearch = searchParams.get('search') || '';
    
    useEffect(() => {
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [urlSearch]);
    
    const { 
        data, 
        isLoading,
        isError, 
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfiniteLpList({ 
        search: searchQuery, 
        order, 
        limit: 20 
    });

    // ✅ 무한 스크롤 구현
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(searchQuery ? { search: searchQuery } : {});
    };

    const handleOrderChange = (newOrder: 'asc' | 'desc') => {
        setOrder(newOrder);
    };

    // ✅ 초기 로딩 (상단 스켈레톤)
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">LP 목록</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <LpCardSkeletonGrid count={20} />
                </div>
            </div>
        );
    }
    
    // ✅ 에러 상태
    if (isError) {
        return (
            <ErrorDisplay 
                message="LP 목록을 불러오는데 실패했습니다."
                error={error}
                onRetry={refetch}
            />
        );
    }

    // ✅ 모든 페이지의 데이터를 평탄화
    const allLps = data?.pages.flatMap(page => page.data) || [];

    return (
        <div className="p-6">
            {/* 검색 바 */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="LP 검색..."
                        className="flex-1 px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        검색
                    </button>
                </div>
            </form>

            {/* 정렬 버튼 */}
            <div className="flex justify-end mb-6">
                <div className="inline-flex rounded-lg overflow-hidden">
                    <button 
                        onClick={() => handleOrderChange('desc')} 
                        disabled={isFetchingNextPage}
                        className={`px-6 py-2 text-sm transition-colors disabled:opacity-50 ${
                            order === 'desc' 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        최신순
                    </button>
                    <button 
                        onClick={() => handleOrderChange('asc')} 
                        disabled={isFetchingNextPage}
                        className={`px-6 py-2 text-sm transition-colors disabled:opacity-50 ${
                            order === 'asc' 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>

            {/* LP 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allLps.length > 0 ? (
                    allLps.map((lp: LpItem) => {
                        // ✅ 썸네일 URL 검증
                        const getThumbnail = (url: string) => {
                            // placekitten 같은 placeholder 이미지 필터링
                            if (!url || url.includes('placekitten') || url.includes('placeholder')) {
                                return 'https://via.placeholder.com/400/1a1a1a/ffffff?text=LP+Cover';
                            }
                            return url;
                        };

                        return (
                            <div 
                                key={lp.id} 
                                onClick={() => navigate(`/lp/${lp.id}`)} 
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-800"
                            >
                                <img 
                                    src={getThumbnail(lp.thumbnail)} 
                                    alt={lp.title}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/400/1a1a1a/ffffff?text=No+Image';
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">
                                        {lp.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-300">
                                        <span>
                                            {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
                                        </span>
                                        <span>❤️ {lp.likes?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '표시할 LP가 없습니다.'}
                    </div>
                )}

                {/* ✅ 추가 로딩 중 (하단 스켈레톤) */}
                {isFetchingNextPage && (
                    <LpCardSkeletonGrid count={8} />
                )}
            </div>

            {/* ✅ Intersection Observer 타겟 */}
            <div ref={observerTarget} className="h-10" />

            {/* ✅ 더 이상 데이터가 없을 때 */}
            {!hasNextPage && allLps.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    모든 LP를 불러왔습니다.
                </div>
            )}
        </div>
    );
};

export default MainPage;