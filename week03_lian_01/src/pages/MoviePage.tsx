// 인기 영화 목록을 API로 가져와서 화면에 뿌리는 역할
import { useEffect, useState } from "react";
import axios from "axios";
import { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
  // 영화 배열 상태 선언
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      // data 구조분해 할당
      // 응답 타입을 명시함으로써 자동 타입 추론 가능
      const { data } = await axios.get<MovieResponse>(
        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=2",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          }, // TMDB에서 요구하는 Bearer 토큰을 .env에서 가져옴
        }
      );
      setMovies(data.results); // 영화 목록(results 배열)을 상태에 저장
    };

    fetchMovies();
    // fetch를 사용하게 되면 실제 값들은 response.json으로 한번 풀어주는 과정이 필요하다
    // 하지만 번거롭다!
    // 그래서 axios를 사용
  }, []);
  // grid-cols-3, grid-cols-4 화면 크기에 따라 컬럼 수를 조절
  // gap-4 → 카드 사이의 간격
  // 영화 배열을 순회하며 <MovieCard /> 컴포넌트를 렌더링
  return (
    <div className="p-10 grid gap-4 sm:grid-cols-3 md: grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
