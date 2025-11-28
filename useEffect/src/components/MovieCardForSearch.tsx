// src/components/MovieCardForSearch.tsx

import React from "react";
import type { Movie } from "../types/Movie";

interface MovieCardProps {
    movie: Movie;
    onSelect: (movie: Movie) => void; // 모달을 열기 위한 핸들러
}

export const MovieCardForSearch = React.memo(({ movie, onSelect }: MovieCardProps) => {
    
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';
    const NO_IMAGE_URL = 'https://via.placeholder.com/200x300?text=No+Image';

    const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : NO_IMAGE_URL;
    
    return (
        <div
            onClick={() => onSelect(movie)}
            className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer
            w-full transition-transform duration-300 hover:scale-105 bg-white border border-gray-200"
        >
            <img 
                src={posterUrl} 
                alt={`${movie.title} 영화의 이미지`} 
                className="w-full h-auto object-cover" // 이미지 비율 유지
            />
            <div className="p-3 text-sm text-left">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{movie.title}</h3>
                <p className="text-xs text-gray-600">
                    <span className="font-semibold">⭐️ {movie.vote_average.toFixed(1)}</span>
                    <span className="ml-2">개봉일: {movie.release_date}</span>
                </p>
                {/* 예시 이미지에 있는 "2023년 07월 20일" 등 개봉일과 유사하게 표시 */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                    {movie.overview || "줄거리 정보가 없습니다."}
                </p>
            </div>
        </div>
    );
});