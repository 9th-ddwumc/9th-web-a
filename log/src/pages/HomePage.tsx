// src/pages/HomePage.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import useThrottle from '../hooks/useThrottle';
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
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const observerTarget = useRef<HTMLDivElement>(null);
    
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
        search: '', 
        order, 
        limit: 20 
    });

    // ✅ 스로틀링된 데이터 요청 함수 (1초에 최대 1번만 실행)
    const throttledFetch = useThrottle(() => {
        if (hasNextPage && !isFetchingNextPage) {
            console.log('✅ Throttled fetch executed (1s interval)');
            fetchNextPage();
        }
    }, 1000); // 1000ms = 1초

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // ✅ 화면 바닥에 닿으면(isIntersecting) 즉시 스로틀된 함수 호출
                // 스로틀링 덕분에 여러 번 감지되어도 1초에 1번만 실제 요청이 나감
                if (entries[0].isIntersecting) {
                    throttledFetch();
                }
            },
            { 
                threshold: 0.5, // 50% 정도 보였을 때 미리 감지
                rootMargin: '100px' // 바닥보다 100px 위에서 미리 감지하여 자연스럽게 로딩
            }
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
    }, [throttledFetch]); // throttledFetch가 변경될 때만 재실행

    const handleOrderChange = (newOrder: 'asc' | 'desc') => {
        setOrder(newOrder);
    };

    if (isLoading) {
        return (
            <div className="w-full px-6 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">LP 목록</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    <LpCardSkeletonGrid count={20} />
                </div>
            </div>
        );
    }
    
    if (isError) {
        return (
            <ErrorDisplay 
                message="LP 목록을 불러오는데 실패했습니다."
                error={error}
                onRetry={refetch}
            />
        );
    }

    const allLps = data?.pages.flatMap(page => page.data) || [];

    const getThumbnail = (url: string) => {
        if (!url || url.includes('placekitten') || url.includes('placeholder')) {
            return 'https://via.placeholder.com/400/1a1a1a/ffffff?text=LP+Cover';
        }
        return url;
    };

    return (
        <div className="w-full px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">LP 목록</h1>
                
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {allLps.length > 0 ? (
                    allLps.map((lp: LpItem) => (
                        <div 
                            key={lp.id} 
                            onClick={() => navigate(`/lp/${lp.id}`)} 
                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-800"
                        >
                            <img 
                                src={getThumbnail(lp.thumbnail)} 
                                alt={lp.title}
                                loading="lazy"
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
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        표시할 LP가 없습니다.
                    </div>
                )}

                {isFetchingNextPage && (
                    <LpCardSkeletonGrid count={8} />
                )}
            </div>

            <div ref={observerTarget} className="h-10" />

            {!hasNextPage && allLps.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    모든 LP를 불러왔습니다.
                </div>
            )}
        </div>
    );
};

export default MainPage;