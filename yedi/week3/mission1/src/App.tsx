import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';  // MovieCard 컴포넌트를 불러옴

// 받아올 영화 데이터 타입 정의
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

function App() {
  // state 생성
  const [movies, setMovies] = useState<Movie[]>([]);  //영화 목록 배열을 저장할 공간
  const [loading, setLoading] = useState<boolean>(true);  //데이터 로딩중인지 아닌지 알려주는 상태, 로딩중=true
  const [error, setError] = useState<string | null>(null);  //데이터 요청 실패 시 에러 메시지를 저장할 공간

  // API를 호출할 useEffect 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular',
          {
            params: { api_key: apiKey, language: 'ko-KR' },
          }
        );
        setMovies(response.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className="text-white text-center text-2xl">로딩 중...</div>;
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">인기 영화</h1>
        {/* 영화 목록을 그리드 레이아웃으로 표시 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;