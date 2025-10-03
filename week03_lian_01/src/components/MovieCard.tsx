// 각각의 영화 카드를 UI로 구성, hover 시 상세 정보 표시
import { useState } from "react";
import { Movie } from "../types/movie";

// props로 받을 데이터의 타입을 명확히 지정
interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false); // 마우스 hover 여부에 따라 오버레이 UI를 표시할지 결정

  return (
    <div
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} // 각 영화의 poster_path를 붙여 포스터 이미지 구성
        alt={`${movie.title}의 포스터`}
        className="w-full h-auto"
      />

      {isHovered && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md
            flex flex-col justify-center items-center text-white p-4"
        >
          <h2 className="text-lg font-bold leading-snug text-center">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-3">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}
