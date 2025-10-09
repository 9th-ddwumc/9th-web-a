import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [hover, setHover] = useState(false);
  const nav = useNavigate();
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/no-poster.png";

  return (
    <div
      onClick={() => nav(`/movie/${movie.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <img src={poster} alt={movie.title} className="block h-auto w-full" />
      {hover && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
          <div>
            <p className="line-clamp-2 text-sm font-semibold">{movie.title}</p>
            <p className="line-clamp-2 text-xs text-gray-200">{movie.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}
