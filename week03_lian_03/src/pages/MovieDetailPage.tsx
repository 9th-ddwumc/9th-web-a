// src/pages/MovieDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, CreditsResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const tmdb = (p: string | null, size: "original" | "w500" | "w780" | "w185" = "original") =>
    p ? `https://image.tmdb.org/t/p/${size}${p}` : "";

  const profile = (p: string | null) =>
    p ? `https://image.tmdb.org/t/p/w185${p}` : "https://via.placeholder.com/185?text=No+Image";

  useEffect(() => {
    const run = async () => {
      if (!movieId) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [m, c] = await Promise.all([
          axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
          axios.get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
          }),
        ]);
        setMovie(m.data);
        setCredits(c.data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie || !credits) {
    return (
      <div className="mt-10 text-center text-red-500">영화 정보를 불러오지 못했어요.</div>
    );
  }

  const director = credits.crew.find((p) => p.job === "Director");
  const cast = credits.cast.slice(0, 18); // 보여줄 출연 수

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* HERO */}
      <div
        className="relative h-[56vh] min-h-[420px] overflow-hidden rounded-xl shadow-xl"
        style={{
          backgroundImage: movie.backdrop_path ? `url(${tmdb(movie.backdrop_path, "original")})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#111",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div className="max-w-[640px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
              <h1 className="text-3xl font-extrabold md:text-4xl">{movie.title}</h1>
              <ul className="mt-2 space-y-0.5 text-sm text-gray-200/90">
                <li>평균 {movie.vote_average.toFixed(1)}</li>
                <li>{movie.release_date?.slice(0, 4)}</li>
                <li>{movie.runtime}분</li>
              </ul>
              {movie.tagline && (
                <p className="mt-3 text-base italic text-gray-200">{movie.tagline}</p>
              )}
              {movie.overview && (
                <p className="mt-3 max-h-40 overflow-hidden text-sm leading-relaxed">
                  {movie.overview}
                </p>
              )}
              <div className="mt-5 h-px w-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* 감독/출연(동글동글) */}
      <section className="mt-10 rounded-xl bg-black p-8 shadow-xl">
        <h2 className="mb-8 text-2xl font-semibold text-white">감독/출연</h2>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {/* 감독: 맨 앞 고정 + 원형 */}
          {director && (
            <figure className="text-center">
              <img
                src={profile(director.profile_path)}
                alt={director.name}
                className="mx-auto h-24 w-24 rounded-full object-cover shadow-md ring-2 ring-white/10"
              />
              <figcaption className="mt-2">
                <p className="font-semibold text-white">{director.name}</p>
                <p className="text-xs text-gray-400">Director</p>
              </figcaption>
            </figure>
          )}

          {/* 출연: 원형 아바타 */}
          {cast.map((a) => (
            <figure key={a.id} className="text-center">
              <img
                src={profile(a.profile_path)}
                alt={a.name}
                className="mx-auto h-24 w-24 rounded-full object-cover shadow-md ring-2 ring-white/10"
              />
              <figcaption className="mt-2">
                <p className="font-semibold text-white">{a.name}</p>
                <p className="text-xs text-gray-400">{a.character}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
