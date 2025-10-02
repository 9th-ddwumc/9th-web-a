// src/pages/MoviePage.tsx (App.tsx나 다른 페이지에 삽입 가능)
import { useState, useEffect } from 'react';
import axios, { type AxiosResponse } from 'axios'; // AxiosResponse 임포트
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/Movie';

export default function MoviePage() {
  // 영화 목록 상태 (Movie 타입 배열)
  const [movies, setMovies] = useState<Movie[]>([]); 
  
  // TMDB API 기본 설정
  const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
  
  // 환경 변수에서 토큰을 안전하게 불러옵니다.
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY; 

  // 데이터 패칭 함수 (useEffect 내에서 호출하기 위해 비동기로 정의)
  const fetchMovies = async () => {
    try {
      // Axios 요청: 응답 데이터의 타입을 MovieResponse로 명시 (타입 세이프티 확보)
      const response: AxiosResponse<MovieResponse> = await axios.get(
        TMDB_API_URL,
        {
          params: {
            language: 'ko-KR', // 한국어로 데이터를 요청
          },
          headers: {
            // 헤더에 인증 정보 포함
            Authorization: `Bearer ${TMDB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 데이터 (axios는 .data 안에 실질적인 응답이 담겨 있음)
      setMovies(response.data.results);
      
    } catch (error) {
      console.error('영화 데이터를 불러오는 중 오류 발생:', error);
      // 로딩 상태나 에러 상태 처리 로직 추가 가능
    }
  };

  // 컴포넌트 마운트 시 한 번만 데이터 패칭 실행
  useEffect(() => {
    fetchMovies();
  }, []); // 의존성 배열이 비어있으므로 최초 1회만 실행

  return (
    <div className="p-10"> {/* 상위 패딩 추가 */}
      <h1 className="text-3xl font-bold mb-8 text-center">TMDB 인기 영화</h1>
      
      {/* 데이터가 로드된 경우에만 렌더링 */}
      {movies.length > 0 ? (
        <div 
          className="grid gap-6 
                     grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">영화를 불러오는 중입니다...</p>
      )}
    </div>
  );
}