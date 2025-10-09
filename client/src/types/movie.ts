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

export type Genre = { id: number; name: string };

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
  tagline?: string;
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  order?: number;
  cast_id?: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path: string | null;
};

export type CreditsResponse = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export type MovieCredits = CreditsResponse;
