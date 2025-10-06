// src/types/Movie.ts

// 영화 한 개에 대한 타입
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number; // 키 값으로 사용
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null; // 이미지 경로
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// TMDB API의 전체 응답 구조에 대한 타입
export interface MovieResponse {
  page: number;
  results: Movie[]; // 핵심 데이터: 영화 객체의 배열
  total_pages: number;
  total_results: number;
}


// --- 1. 타입 정의 ---

export interface Genre { 
  id: number; 
  name: string; 
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null; // 배경 이미지 추가
  release_date: string;
  vote_average: number;
  genres: Genre[];
  runtime: number | null;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string; // "Director", "Writer" 등으로 사용
  profile_path: string | null;
}

export interface CreditsResponse {
  cast: Cast[];
  crew: Crew[];
}