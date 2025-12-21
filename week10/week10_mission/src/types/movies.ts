export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  // 필요한 필드 추가
  backdrop_path: string | null; // 배경 이미지 경로
  original_title: string;       // 원제
  vote_count: number;           // 투표 수
  release_date: string;         // 개봉일
  popularity: number;           // 인기도
  adult: boolean;               // 성인 영화 여부 (필요시)
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface MovieFilterState {
  query: string;
  includeAdult: boolean;
  language: string;
}