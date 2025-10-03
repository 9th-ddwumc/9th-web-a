import { useState } from "react";
import { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

// movie: Movie 타입을 가진 객체 (영화 한 편에 대한 정보)
// 이 컴포넌트는 movie 하나를 받아서 화면에 보여줌
interface MovieCardProps {
  movie: Movie;
}

// TMDB 영화 정보를 카드 형태로 보여주는 UI 컴포넌트
export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer  w-44 transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title}의 포스터`}
        className=""
      />

      {/* Hover 시 보여지는 오버레이 */}
      {/* isHovered === true일 때만 렌더링됨 */}
      {isHovered && (
        <div
          className="absolute  inset-0 bg-gradient-to-t from black/50 to to-transparent backdrop-blur-md
            flex flex-col justify-center items-center text-white p-4"
        >
          <h2 className="text-lg font-bold leading-snug">{movie.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}
