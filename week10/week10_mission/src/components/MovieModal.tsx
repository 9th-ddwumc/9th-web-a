// src/components/MovieModal.tsx

import React, { useEffect, useRef } from 'react';
import type { Movie } from '../types/movies';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 모달 바깥 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
      >
        {/* 상단 배경 이미지 및 닫기 버튼 */}
        <div className="relative h-64 md:h-80 bg-gray-900">
            <img 
                src={backdropUrl} 
                alt={`${movie.title} backdrop`} 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors focus:outline-none"
                aria-label="Close modal"
            >
                {/* 아이콘 라이브러리가 있다면 <XMarkIcon className="w-6 h-6" /> 등으로 교체 */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* 제목 (배경 위에 오버레이) */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{movie.title}</h2>
                {movie.original_title !== movie.title && (
                    <p className="text-sm text-gray-300 mt-1">{movie.original_title}</p>
                )}
            </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-6 flex flex-col md:flex-row gap-6 bg-white">
          {/* 포스터 (상단 배경과 살짝 겹치게) */}
          <div className="hidden md:block flex-shrink-0 -mt-24 z-10">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="w-52 h-auto rounded-lg shadow-lg border-2 border-white"
            />
          </div>
          <div className="md:hidden flex justify-center -mt-24 z-10">
             <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="w-40 h-auto rounded-lg shadow-lg border-2 border-white"
            />
          </div>

          {/* 상세 정보 */}
          <div className="flex-1 flex flex-col gap-4 text-gray-800">
            {/* 평점 */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-2xl font-bold text-blue-600">{movie.vote_average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({movie.vote_count.toLocaleString()}명 참여)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-semibold text-gray-600 block mb-1">개봉일</span>
                    <span>{movie.release_date || '정보 없음'}</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-600 block mb-1">인기도</span>
                    <span>{Math.round(movie.popularity).toLocaleString()}</span>
                </div>
                {/* 필요한 경우 추가 정보 필드 배치 */}
            </div>

            {/* 줄거리 */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-700">줄거리</h3>
              <p className="text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>

            {/* 하단 버튼 그룹 (예시) */}
            <div className="flex gap-3 mt-auto pt-4">
              {/* 실제 링크가 있다면 href에 연결 */}
              <a 
                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-medium text-center transition-colors"
              >
                IMDb에서 검색
              </a>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-md font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;

// tailwind.config.js에 추가할 애니메이션 설정 (선택사항)
// theme: {
//   extend: {
//     keyframes: {
//       'fade-in-up': {
//         '0%': {
//           opacity: '0',
//           transform: 'translateY(20px)'
//         },
//         '100%': {
//           opacity: '1',
//           transform: 'translateY(0)'
//         },
//       }
//     },
//     animation: {
//       'fade-in-up': 'fade-in-up 0.3s ease-out'
//     }
//   }
// }