import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetLpList from '../hooks/queries/useGetLpList';
import { Loading, ErrorDisplay } from '../component/LoadingError';

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
    
    const { 
        data, 
        isPending, 
        isError, 
        error,
        refetch,
        isFetching 
    } = useGetLpList({ 
        search: '', 
        order, 
        limit: 20 
    });

    // ✅ 공통 로딩 컴포넌트 사용
    if (isPending) {
        return <Loading message="LP 목록을 불러오는 중..." />;
    }
    
    // ✅ 공통 에러 컴포넌트 사용
    if (isError) {
        return (
            <ErrorDisplay 
                message="LP 목록을 불러오는데 실패했습니다."
                error={error}
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="p-6">
            {/* 정렬 버튼 */}
            <div className="flex justify-end mb-6">
                <div className="inline-flex rounded-lg overflow-hidden">
                    <button 
                        onClick={() => setOrder('desc')} 
                        disabled={isFetching}
                        className={`px-6 py-2 text-sm transition-colors disabled:opacity-50 ${
                            order === 'desc' 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        오래된순
                    </button>
                    <button 
                        onClick={() => setOrder('asc')} 
                        disabled={isFetching}
                        className={`px-6 py-2 text-sm transition-colors disabled:opacity-50 ${
                            order === 'asc' 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            {/* 데이터 페칭 중 표시 */}
            {isFetching && (
                <div className="flex justify-center mb-4">
                    <div className="text-pink-500 text-sm">데이터를 불러오는 중...</div>
                </div>
            )}

            {/* LP 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data && data.length > 0 ? (
                    data.map((lp: LpItem) => (
                        <div 
                            key={lp.id} 
                            onClick={() => navigate(`/lp/${lp.id}`)} 
                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-800"
                        >
                            <img 
                                src={lp.thumbnail || 'https://via.placeholder.com/400'} 
                                alt={lp.title}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400?text=No+Image';
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
            </div>
        </div>
    );
};

export default MainPage;