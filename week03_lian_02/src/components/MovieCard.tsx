import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/no-poster.png"; // 포스터 없을 때 대체 이미지

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)} // 카드 클릭 시 상세 페이지 이동
      className="cursor-pointer rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      <img
        src={poster}
        alt={movie.title}
        className="w-full h-auto block"
        loading="lazy"
      />
      <div className="p-2 text-center">
        <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400">{movie.release_date}</p>
      </div>
    </div>
  );
}
