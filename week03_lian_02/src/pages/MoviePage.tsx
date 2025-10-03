import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Movie, MovieResponse } from "../types/movie";

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`, // .env에 있는 TMDB 키
            },
          }
        );
        setMovies(data.results);
      } catch (err) {
        console.error("영화 데이터 불러오기 실패:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [category, page]);

  // 에러 처리
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-xl">
        영화 데이터를 불러오는 중 오류가 발생했습니다 😢
      </div>
    );
  }

  // 로딩 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          &lt;
        </button>
        <span>{page} 페이지</span>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          &gt;
        </button>
      </div>

      {/* 영화 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
