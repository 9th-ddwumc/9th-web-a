import type { Movie } from '../types/movies';
import MovieCard from './MovieCard';

interface Props {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieList({ movies, onMovieClick }: Props) {
  if (movies.length === 0) {
    return <div className="text-center text-gray-500">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie.id} onClick={() => onMovieClick(movie)} className="cursor-pointer">
            <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}