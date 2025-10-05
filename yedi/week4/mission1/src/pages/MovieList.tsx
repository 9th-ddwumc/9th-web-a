import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner'; 
import useCustomFetch from '../hooks/useCustomFetch'; //Custom Hook 불러오기

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface MovieListData {
  results: Movie[];
}

const MovieList = () => {
  const { category = 'popular' } = useParams<{ category?: string }>(); // category 기본값 설정
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  // const [error, setError] = useState<string | null>(null);   // 에러 상태
  const [currentPage, setCurrentPage] = useState<number>(1); // 페이지 번호 상태 추가

  // 기존 useState와 useEffect를 useCustomFetch 훅으로 대체
  const { data: movieData, loading, error } = useCustomFetch<MovieListData>(
    `/movie/${category}`, // API endpoint
    { page: currentPage }    // 추가 파라미터 (페이지 번호)
  );

    useEffect(() => {
    // 페이지가 바뀔 때 화면 최상단으로 스크롤 이동
    window.scrollTo(0, 0);
  }, [category, currentPage]);

  // 페이지 이동 버튼 핸들러
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center text-2xl">{error}</div>;
  }

return (
    <>
    {/* 페이지네이션 UI */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-pink-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          &lt;
        </button>
        <span className="text-xl font-bold">{currentPage} 페이지</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {/* 3. movieData에서 영화 목록을 가져와 렌더링 */}
        {movieData?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MovieList;