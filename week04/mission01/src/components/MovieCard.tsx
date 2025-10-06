// src/components/MovieCard.tsx
import { useState } from 'react';
import type { Movie } from '../types/Movie';

// 이미지 기본 URL (TMDB)
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void; // ✅ MoviePage에서 넘겨주는 클릭 이벤트 핸들러 추가
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  // 마우스 오버 상태 관리
  const [isHovered, setIsHovered] = useState(false);
  
  // 이미지 URL (null 처리 및 기본 URL 접두사 붙이기)
  const imageUrl = movie.poster_path 
    ? `${BASE_IMAGE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    // 최상위 컨테이너: 마우스 이벤트, 라운드 처리, 그림자, 트랜지션
    <div
      key={movie.id}
      className="relative rounded-xl shadow-lg cursor-pointer overflow-hidden 
                 transition transform duration-300 hover:scale-[1.02]" // 호버 애니메이션
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 1. 영화 포스터 이미지 */}
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />

      {/* 2. 호버 시 표시되는 정보 오버레이 (isHovered 상태에 따라 표시) */}
      {isHovered && (
        <div
          className="absolute inset-0 flex flex-col justify-center items-center p-4 
                     bg-black bg-opacity-70 text-white text-center 
                     backdrop-blur-sm" // 배경 흐림 효과
        >
          <h2 className="text-xl font-bold mb-2 leading-snug">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-5"> {/* 최대 5줄만 표시 */}
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}