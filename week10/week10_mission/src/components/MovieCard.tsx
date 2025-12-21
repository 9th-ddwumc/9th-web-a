import type { Movie } from '../types/movies';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'; // 대체 이미지

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white relative">
      <img src={imageUrl} alt={movie.title} className="w-full h-auto object-cover" />
      <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
        {movie.vote_average.toFixed(1)}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{movie.title}</h3>
      </div>
    </div>
  );
}