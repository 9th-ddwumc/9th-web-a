import { useState, useMemo, useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import MovieFilter from '../components/MovieFilter';
import MovieList from '../components/MovieList';
import type { MovieResponse, MovieFilterState, Movie } from '../types/movies';
import MovieModal from '../components/MovieModal';

export default function HomePage() {
  // 필터 상태 관리
  const [filters, setFilters] = useState<MovieFilterState>({
    query: 'Avengers', // 기본 검색어
    includeAdult: false,
    language: 'ko-KR',
  });

  // 모달 관련 state 추가
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // [최적화 1] useFetch에 전달할 옵션 객체를 useMemo로 메모이제이션
  // filters 상태가 변할 때만 이 객체가 새로 생성됨 -> useFetch 내부의 useEffect 트리거
  const fetchOptions = useMemo(() => ({
    params: {
      query: filters.query,
      include_adult: filters.includeAdult,
      language: filters.language,
    },
  }), [filters]);

  // 데이터 패칭
  const { data, isLoading, error } = useFetch<MovieResponse>('/search/movie', fetchOptions);

  // [최적화 2] 자식 컴포넌트(MovieFilter)에 전달할 함수를 useCallback으로 메모이제이션
  // HomePage가 리렌더링(예: isLoading 변경)되어도 이 함수는 재생성되지 않음
  // -> MovieFilter(React.memo)가 리렌더링되지 않음
  const handleSearch = useCallback((newFilters: MovieFilterState) => {
    setFilters(newFilters);
  }, []);

  // 영화 카드 클릭 핸들러 추가
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러 추가
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 약간의 지연 후 데이터 초기화 (애니메이션 고려)
    setTimeout(() => setSelectedMovie(null), 300); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">영화 검색 사이트</h1>
      
      {/* useCallback된 함수 전달 */}
      <MovieFilter onSearch={handleSearch} />

      {isLoading && <div className="text-center">로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      
      {data && <MovieList movies={data.results} onMovieClick={handleMovieClick}/>}

      {/* 모달 컴포넌트 렌더링 */}
      <MovieModal 
        movie={selectedMovie} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}