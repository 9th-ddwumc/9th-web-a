// src/pages/HomePage.tsx

import { Navbar } from "../components/Navbar";
import { useState, useCallback, useEffect, useMemo } from 'react';
import { SearchForm } from '../components/SearchForm';
import { searchMovies } from '../api/tmdb';
import { MovieCardForSearch } from '../components/MovieCardForSearch';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Movie } from "../types/Movie";

const HomePage = () => {
    
    // 상태 관리
    const [queryTitle, setQueryTitle] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [language, setLanguage] = useState('ko-KR');
    const [includeAdult, setIncludeAdult] = useState(false);
    
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);
    
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // ********** ⚙️ 성능 최적화: useCallback 적용 **********

    const handleTitleChange = useCallback((value: string) => {
        setQueryTitle(value);
    }, []);

    const handleLanguageChange = useCallback((value: string) => {
        setLanguage(value);
    }, []);

    const handleIncludeAdultChange = useCallback((checked: boolean) => {
        setIncludeAdult(checked);
    }, []);
    
    const handleSearchSubmit = useCallback(() => {
        setSearchTitle(queryTitle.trim());
    }, [queryTitle]);

    const handleMovieSelect = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);
    
    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);

    // ********** API 호출 로직 **********

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTitle === '') {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            setSearchError(false);

            try {
                const data = await searchMovies({ 
                    query: searchTitle, 
                    language, 
                    includeAdult 
                });
                setSearchResults(data.results);
            } catch (e) {
                console.error("Search failed", e);
                setSearchError(true);
            } finally {
                setIsSearching(false);
            }
        };

        fetchSearchResults();
    }, [searchTitle, language, includeAdult]);

    // ********** ⚙️ 성능 최적화: useMemo 적용 **********

    const sortedMovies = useMemo(() => {
        return [...searchResults].sort((a, b) => b.vote_average - a.vote_average);
    }, [searchResults]);

    // 렌더링 로직 단순화: 검색을 시도했거나 상태 변화가 있을 경우 검색 결과 표시
    const showSearchResults = searchTitle !== '' || isSearching || searchError;

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <Navbar/>
            <div className="max-w-7xl mx-auto mt-8">
                
                {/* 검색 폼 */}
                <SearchForm
                    title={queryTitle}
                    language={language}
                    includeAdult={includeAdult}
                    onTitleChange={handleTitleChange}
                    onLanguageChange={handleLanguageChange}
                    onIncludeAdultChange={handleIncludeAdultChange}
                    onSubmit={handleSearchSubmit}
                />
                
                {/* 검색을 시도하지 않았을 때의 기본 메시지 */}
                {!showSearchResults && searchResults.length === 0 && (
                    <p className="text-center text-gray-500 text-lg mt-8">영화 제목을 검색해 보세요.</p>
                )}
                
                {/* 검색 결과 표시 블록 */}
                {showSearchResults && (
                    <>
                        <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">영화 검색 결과</h2>
                        
                        {searchError && (
                            <p className="text-red-500 text-center text-lg mt-8">
                                검색 중 오류가 발생했습니다.
                            </p>
                        )}

                        {isSearching && (
                            <div className='flex items-center justify-center h-48 mt-8'>
                                <LoadingSpinner/>
                            </div>
                        )}
                        
                        {!isSearching && !searchError && sortedMovies.length === 0 && (
                            <p className="text-center text-gray-500 text-lg mt-8">
                                '{searchTitle}'에 대한 검색 결과가 없습니다.
                            </p>
                        )}

                        {!isSearching && sortedMovies.length > 0 && (
                            <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8'>
                                {sortedMovies.map((movie)=>(
                                    <MovieCardForSearch 
                                        key={movie.id} 
                                        movie={movie} 
                                        onSelect={handleMovieSelect}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* 모달 */}
            <Modal movie={selectedMovie} onClose={handleCloseModal} />
        </div>
    );
}

export default HomePage;