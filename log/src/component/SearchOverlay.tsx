// src/component/SearchOverlay.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import useDebounce from '../hooks/useDebounce';
import useThrottle from '../hooks/useThrottle';
import { ErrorDisplay } from './LoadingError';
import { LpCardSkeletonGrid } from './skeletonUi';

const RECENT_SEARCH_KEY = 'recent_searches';

interface LpItem {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: any[];
}

interface SearchOverlayProps {
    isSidebarOpen?: boolean;
}

const SearchOverlay = ({ isSidebarOpen }: SearchOverlayProps) => {
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'title' | 'tag'>('title');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    
    const observerTarget = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    
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
        search: debouncedSearchQuery.trim(),
        order, 
        limit: 20 
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        const stored = localStorage.getItem(RECENT_SEARCH_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recent searches');
            }
        }
        return () => clearTimeout(timer);
    }, []);

    const saveSearchTerm = (term: string) => {
        if (!term.trim()) return;
        const newHistory = [term, ...recentSearches.filter(t => t !== term)].slice(0, 10);
        setRecentSearches(newHistory);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newHistory));
    };

    const removeRecentSearch = (termToRemove: string) => {
        const newHistory = recentSearches.filter(term => term !== termToRemove);
        setRecentSearches(newHistory);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newHistory));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCH_KEY);
    };

    // ✅ Throttled fetch for Search
    const throttledFetch = useThrottle(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, 1000);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    throttledFetch();
                }
            },
            { threshold: 0.5, rootMargin: '100px' }
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
    }, [throttledFetch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            saveSearchTerm(searchQuery.trim());
        }
    };

    const handleRecentClick = (term: string) => {
        setSearchQuery(term);
        saveSearchTerm(term);
        inputRef.current?.focus();
    };

    const allLps = data?.pages.flatMap(page => page.data) || [];

    const getThumbnail = (url: string) => {
        if (!url || url.includes('placekitten') || url.includes('placeholder')) {
            return 'https://via.placeholder.com/400/1a1a1a/ffffff?text=LP+Cover';
        }
        return url;
    };

    return (
        <div 
            className={`
                fixed inset-0 top-16 z-30 bg-black overflow-y-auto 
                transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'lg:pl-64' : ''}
            `}
        >
            <div className="min-h-full pt-12 px-4 md:px-8 max-w-7xl mx-auto">
                
                {/* 검색 입력 영역 */}
                <div className="max-w-3xl mx-auto mb-12">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center border-b border-gray-600 pb-3 focus-within:border-pink-500 transition-colors relative">
                            <svg className="w-8 h-8 text-gray-400 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            <input
                                key="search-input"
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어를 입력하세요"
                                className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 focus:outline-none min-w-0"
                                autoFocus
                                autoComplete="off"
                            />

                            {(isLoading || searchQuery !== debouncedSearchQuery) && (
                                <div className="absolute right-[100px] top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            <div className="ml-4 relative flex-shrink-0">
                                <select 
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as 'title' | 'tag')}
                                    className="appearance-none bg-transparent border border-gray-600 rounded px-4 py-2 pr-8 text-white focus:outline-none focus:border-pink-500 cursor-pointer bg-gray-900"
                                >
                                    <option value="title">제목</option>
                                    <option value="tag">태그</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* 최근 검색어 */}
                    {recentSearches.length > 0 && !searchQuery && (
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">최근 검색어</h3>
                                <button 
                                    onClick={clearRecentSearches}
                                    className="text-sm text-gray-500 hover:text-gray-300"
                                >
                                    모두 지우기
                                </button>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {recentSearches.map((term, index) => (
                                    <li key={index} className="flex items-center justify-between group cursor-pointer" onClick={() => handleRecentClick(term)}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 group-hover:text-pink-500 transition-colors">✕</span>
                                            <span className="text-gray-300 group-hover:text-white transition-colors text-lg">{term}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(term);
                                            }}
                                            className="text-gray-600 hover:text-red-500 p-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* 검색 결과 그리드 */}
                <div className="mb-8 flex justify-between items-center">
                    {debouncedSearchQuery && (
                        <p className="text-gray-400">
                            <span className="text-pink-500 font-bold">"{debouncedSearchQuery}"</span> 검색 결과
                        </p>
                    )}
                    
                    {allLps.length > 0 && (
                        <div className="flex gap-2 text-sm">
                            <button 
                                onClick={() => setOrder('desc')}
                                className={`${order === 'desc' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                최신순
                            </button>
                            <span className="text-gray-700">|</span>
                            <button 
                                onClick={() => setOrder('asc')}
                                className={`${order === 'asc' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                오래된순
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <LpCardSkeletonGrid count={8} />
                    </div>
                ) : isError ? (
                    <ErrorDisplay 
                        message="검색 중 오류가 발생했습니다."
                        error={error}
                        onRetry={refetch}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                            {allLps.length > 0 ? (
                                allLps.map((lp: LpItem) => (
                                    <div 
                                        key={lp.id} 
                                        onClick={() => {
                                            navigate(`/lp/${lp.id}`);
                                        }} 
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
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                                                {lp.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-gray-300">
                                                <span>
                                                    {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    💖 {lp.likes?.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : debouncedSearchQuery ? (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
                                </div>
                            ) : null}
                            
                            {isFetchingNextPage && <LpCardSkeletonGrid count={4} />}
                        </div>
                        <div ref={observerTarget} className="h-10" />
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;