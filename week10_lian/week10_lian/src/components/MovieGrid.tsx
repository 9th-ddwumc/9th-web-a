import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
};

export default function MovieGrid({ movies, onSelect }: Props) {
  if (movies.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onClick={onSelect} />
      ))}
    </div>
  );
}
