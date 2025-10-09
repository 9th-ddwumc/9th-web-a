import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { tmdb } from "../lib/tmdb";
import { useCustomFetch } from "../hooks/useCustomFetch";

const ALLOWED = ["popular", "now_playing", "top_rated", "upcoming"] as const;
type Category = (typeof ALLOWED)[number];

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  const nav = useNavigate();

  const cat: Category = useMemo(() => {
    if (category && ALLOWED.includes(category as Category)) return category as Category;
    return "popular";
  }, [category]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    if (!ALLOWED.includes(cat)) nav("/movies/popular", { replace: true });
  }, [cat, nav]);

  const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
    () => tmdb.get<MovieResponse>(`/movie/${cat}?language=ko-KR&page=${page}`).then(r => r.data),
    [cat, page]
  );

  const movies: Movie[] = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  const titleMap: Record<Category, string> = {
    popular: "인기 영화",
    now_playing: "상영 중",
    top_rated: "평점 높은",
    upcoming: "개봉 예정",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-white">{titleMap[cat]}</h1>

      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          className="rounded-lg bg-gray-300 px-4 py-2 text-black disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          &lt;
        </button>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white">{page} 페이지</span>
        <button
          className="rounded-lg bg-[#E52B12] px-4 py-2 text-white disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          &gt;
        </button>
      </div>

      {isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex h-[40vh] items-center justify-center text-red-400">
          영화 목록을 불러오는 중 오류가 발생했어요.
        </div>
      )}

      {!isLoading && !isError && movies.length === 0 && (
        <div className="flex h-[40vh] items-center justify-center text-gray-400">
          이 카테고리에는 영화가 없어요.
        </div>
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
