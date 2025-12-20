import { useCallback, useState } from "react";
import SearchPanel from "./components/SearchPanel";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";
import type { Movie } from "./types/movie";
import { searchMovies } from "./lib/tmdb";

export default function App() {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<"ko-KR" | "en-US" | "ja-JP">("ko-KR");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const trimmed = query.trim();
      if (!trimmed) {
        setMovies([]);
        setStatus("idle");
        setErrorMessage("");
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      try {
        const results = await searchMovies({
          query: trimmed,
          includeAdult,
          language,
        });

        setMovies(results);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMovies([]);
        setErrorMessage(
          err instanceof Error ? err.message : "알 수 없는 에러가 발생했어요."
        );
      }
    },
    [query, includeAdult, language]
  );

  const handleSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const closeModal = useCallback(() => setSelectedMovie(null), []);

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          includeAdult={includeAdult}
          onIncludeAdultChange={setIncludeAdult}
          language={language}
          onLanguageChange={setLanguage}
          onSubmit={handleSubmit}
        />

        <div className="mt-8">
          {status === "loading" && (
            <p className="text-center text-slate-600">검색 중...</p>
          )}

          {status === "error" && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}

          {status !== "loading" && status !== "error" && movies.length === 0 && (
            <p className="text-center text-slate-500">
              영화 제목을 입력하고 검색해보세요.
            </p>
          )}

          <MovieGrid movies={movies} onSelect={handleSelect} />
        </div>
      </div>

      {/* ✅ 모달 */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
