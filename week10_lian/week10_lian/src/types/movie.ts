export type Movie = {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string; // YYYY-MM-DD
  posterUrl: string | null;
  backdropUrl: string | null;

  voteAverage: number; // 0~10
  voteCount: number;
  popularity: number;
};
