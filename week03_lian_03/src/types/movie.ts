// 영화 데이터 타입 정의 파일 (Movie, MovieResponse 등)
export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export interface MovieDetail {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  poster_path: string;
  genres: { id: number; name: string }[];
}

export interface MovieCredits {
  cast: {
    cast_id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    job: string;
    name: string;
    profile_path: string | null;
  }[];
}
