// src/pages/HomePage.tsx

import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useState, useCallback, useEffect, useMemo } from 'react';
import { SearchForm } from '../components/SearchForm';
import { searchMovies } from '../api/tmdb';
import { MovieCardForSearch } from '../components/MovieCardForSearch';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Movie } from "../types/Movie";

const HomePage = () => {
    // 1. 영화 검색 기능 관련 상태 관리
    
    // 🎬 영화 제목 입력 상태: 사용자가 입력한 값을 상태(state)로 관리
    const [queryTitle, setQueryTitle] = useState('');
    // 실제 검색에 사용될 상태 (엔터/버튼 클릭 시 업데이트)
    const [searchTitle, setSearchTitle] = useState('');
    
    // 🌐 언어 선택 상태: 선택된 언어 값을 상태(state)로 관리
    const [language, setLanguage] = useState('ko-KR');
    
    // 🔞 성인 콘텐츠 상태: 체크 여부를 상태로 관리
    const [includeAdult, setIncludeAdult] = useState(false);
    
    // 검색 결과 및 로딩 상태
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);
    
    // 2. 모달 관련 상태 관리
    // 🪟 영화 상세 정보 모달 구현: 선택된 영화를 상태로 관리
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // ********** ⚙️ 성능 최적화: useCallback 적용 (이벤트 핸들러 참조 고정) **********

    const handleTitleChange = useCallback((value: string) => {
        setQueryTitle(value);
    }, []);

    const handleLanguageChange = useCallback((value: string) => {
        setLanguage(value);
    }, []);

    const handleIncludeAdultChange = useCallback((checked: boolean) => {
        setIncludeAdult(checked);
    }, []);
    
    // 검색 버튼/엔터 입력 시 실제 검색을 시작하는 함수
    const handleSearchSubmit = useCallback(() => {
        setSearchTitle(queryTitle.trim());
    }, [queryTitle]);

    // 영화 카드 클릭 시 모달 열기
    const handleMovieSelect = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);
    
    // 모달 닫기
    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);

    // ********** API 호출 로직 **********

    // searchTitle, language, includeAdult 상태가 변경될 때마다 API 호출
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTitle === '') {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            setSearchError(false);

            try {
                // 🌐 실제 API 호출 시, 선택한 언어 코드가 적용되도록 함
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

    // ********** ⚙️ 성능 최적화: useMemo 적용 (계산 비용이 큰 값 메모이제이션) **********

    // 평점 순으로 정렬하는 계산 결과를 메모이제이션
    const sortedMovies = useMemo(() => {
        // useMemo를 사용하여 검색 결과 목록이 변경될 때만 정렬을 다시 수행
        return [...searchResults].sort((a, b) => b.vote_average - a.vote_average);
    }, [searchResults]);


    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <Navbar/>
            <div className="max-w-7xl mx-auto mt-8">
                
                {/* 🪟 페이지 상단에 영화 검색 영역 레이아웃 */}
                <SearchForm
                    title={queryTitle}
                    language={language}
                    includeAdult={includeAdult}
                    onTitleChange={handleTitleChange}
                    onLanguageChange={handleLanguageChange}
                    onIncludeAdultChange={handleIncludeAdultChange}
                    onSubmit={handleSearchSubmit} // form 태그로 감싸 엔터 입력 시 검색되도록 함
                />
                
                <Outlet/>
                
                {/* 검색 결과 영역 */}
                <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">영화 검색 결과</h2>
                
                {searchError && <p className="text-red-500 text-center text-lg mt-8">검색 중 오류가 발생했습니다.</p>}

                {isSearching && (
                    <div className='flex items-center justify-center h-48 mt-8'>
                        <LoadingSpinner/>
                    </div>
                )}
                
                {!isSearching && !searchError && searchTitle !== '' && sortedMovies.length === 0 && (
                    <p className="text-center text-gray-500 text-lg mt-8">'{searchTitle}'에 대한 검색 결과가 없습니다.</p>
                )}

                {!isSearching && sortedMovies.length > 0 && (
                    <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8'>
                        {/* MovieCardForSearch는 React.memo가 적용되어 최적화됨 */}
                        {sortedMovies.map((movie)=>(
                            <MovieCardForSearch 
                                key={movie.id} 
                                movie={movie} 
                                onSelect={handleMovieSelect} // useCallback으로 감싼 핸들러 전달
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* 🪟 영화 상세 정보 모달 */}
            {/* 중앙에 카드 형태의 모달 박스가 나타나게 구현 */}
            <Modal movie={selectedMovie} onClose={handleCloseModal} />
            
        </div>
    );
}

export default HomePage;