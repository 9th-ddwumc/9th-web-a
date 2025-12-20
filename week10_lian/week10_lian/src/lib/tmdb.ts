import type { Movie } from "../types/movie";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

function getToken() {
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;
  if (!token) {
    throw new Error(
      "TMDB 토큰이 없어요. 루트에 .env 만들고 VITE_TMDB_TOKEN 값을 넣어주세요."
    );
  }
  return token;
}

type SearchMoviesParams = {
  query: string;
  includeAdult: boolean;
  language: string; // ko-KR, en-US, ja-JP
};

export async function searchMovies({
  query,
  includeAdult,
  language,
}: SearchMoviesParams): Promise<Movie[]> {
  const token = getToken();

  const url = new URL(`${TMDB_BASE}/search/movie`);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", String(includeAdult));
  url.searchParams.set("language", language);
  url.searchParams.set("page", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) throw new Error(`TMDB 요청 실패: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    results: Array<{
      id: number;
      title: string;
      original_title: string;
      overview: string;
      release_date: string;
      poster_path: string | null;
      backdrop_path: string | null;
      vote_average: number;
      vote_count: number;
      popularity: number;
    }>;
  };

  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    originalTitle: m.original_title ?? m.title,
    overview: m.overview ?? "",
    releaseDate: m.release_date || "",
    posterUrl: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
    backdropUrl: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
    voteAverage: m.vote_average ?? 0,
    voteCount: m.vote_count ?? 0,
    popularity: m.popularity ?? 0,
  }));
}
