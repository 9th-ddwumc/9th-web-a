import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner'; // LoadingSpinner 불러오기

{/* 로딩 테스트 코드
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));*/}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const MovieList = () => {
  const { category = 'popular' } = useParams<{ category?: string }>(); // category 기본값 설정
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null);   // 에러 상태
  const [currentPage, setCurrentPage] = useState<number>(1); // 페이지 번호 상태 추가

  useEffect(() => {
     // 페이지가 바뀔 때 화면 최상단으로 스크롤 이동
    window.scrollTo(0, 0);

    const fetchMovies = async () => {
      setLoading(true); // API 호출 시작 시 로딩 상태를 true로 설정
      setError(null);   // 이전 에러 상태를 초기화
      try {
        {/*로딩 테스트 코드: API를 호출하기 전에 1초간 기다림
        await sleep(1000); */}

        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${category}`,
          {
            params: { 
              api_key: apiKey, 
              language: 'ko-KR',
              page: currentPage,  
            },
          }
        );
        setMovies(response.data.results);
      } catch (err) {
        setError('에러가 발생했습니다.'); // 에러 발생 시 에러 상태 설정
        console.error(err);
      } finally {
        setLoading(false); // API 호출 완료 시 로딩 상태를 false로 설정
      }
    };

    fetchMovies();
  }, [category, currentPage]); // currentPage가 바뀔 때마다 API 재호출

   // 페이지 이동 버튼 핸들러
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 로딩 중일 때 로딩 스피너를 보여줌
  if (loading) {
    return <LoadingSpinner />;
  }

  // 에러가 발생했을 때 에러 메시지를 보여줌
  if (error) {
    return <div className="text-red-500 text-center text-2xl">{error}</div>;
  }

return (
    <>
    {/* 페이지네이션 UI */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1} // 현재 페이지가 1일 때 버튼 비활성화
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MovieList;