// src/pages/MoviePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/Movie';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCustomFetch } from '../hooks/useCustomFetch'; // 🚨 커스텀 훅 임포트

export default function MoviePage() {
  const { category } = useParams<{ category: string }>(); 
  const navigate = useNavigate();
  
  // 1. 페이지네이션 상태는 그대로 유지
  const [page, setPage] = useState(1); 

  // 2. TMDB API URL 정의 (category 변경 시 URL이 바뀜)
  const TMDB_API_URL = `https://api.themoviedb.org/3/movie/${category || 'popular'}`;

  // 3. 🚨 useCustomFetch 훅 적용
  const { data, isPending, isError } = useCustomFetch<MovieResponse>({
    url: TMDB_API_URL,
    // Axios config: language와 page 파라미터를 동적으로 전달
    config: {
      params: {
        language: 'ko-KR',
        page: page, // 페이지 값 전달
      },
    },
    // 의존성 배열: page가 바뀔 때마다 재요청하도록 명시
    dependencies: [page] 
  });

  // 4. data를 Movie[] 배열로 추출
  const movies = data?.results || [];

  // 5. 🚨 category 변경 시 page를 1로 초기화하는 로직 (훅의 의존성 관리와 별개로 UI 로직으로 유지)
  useEffect(() => {
    // URL 카테고리가 바뀔 때 page를 1로 초기화 (UI/UX 목적)
    setPage(1); 
  }, [category]); 

  // 6. 🚨 로딩 및 에러 분기 처리 (간소화)
  if (isPending && page === 1) { // 첫 페이지 로딩 시 전체 스피너 표시
    return <LoadingSpinner />;
  }
  
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl font-semibold">
          에러가 발생했습니다. (데이터 요청 실패)
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8 text-center capitalize">
        {category?.replace('_', ' ') || '인기'} 영화
      </h1>
      
      {/* 🚨 페이지 이동 시의 로딩 상태를 '더 보기' 등의 방식으로 처리할 수도 있으나, 
          여기서는 명확성을 위해 isPending 상태로 로딩 스피너를 유지합니다. */}
      {isPending && <LoadingSpinner />} 

      {/* 로딩 상태가 아닐 때만 컨텐츠 표시 */}
      {!isPending && (
        <>
          {/* 영화 목록 */}
          {movies.length > 0 ? (
            <div 
              className="grid gap-6 
                         grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => navigate(`/movie/${movie.id}`)} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              데이터가 없습니다.
            </p>
          )}

          {/* 페이지네이션 버튼 */}
          {movies.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className={`px-6 py-3 rounded-lg shadow-md transition-colors duration-200 
                          text-white font-medium 
                          ${page === 1 
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                          }`}
              >
                &larr; 이전
              </button>

              <span className="text-xl font-bold text-gray-700">
                {page} 페이지
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-3 rounded-lg shadow-md transition-colors duration-200 
                           bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                다음 &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}