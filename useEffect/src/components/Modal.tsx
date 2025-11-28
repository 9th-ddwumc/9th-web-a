// src/components/Modal.tsx

import React from 'react';
import type { Movie } from '../types/Movie';

interface ModalProps {
    movie: Movie | null;
    onClose: () => void;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const NO_IMAGE_URL = 'https://via.placeholder.com/500x300?text=No+Image';

export const Modal: React.FC<ModalProps> = ({ movie, onClose }) => {
    if (!movie) return null;

    // 모달 상단에 포스터 이미지 (backdrop_path > poster_path 순으로 사용)
    const modalHeaderImageUrl = movie.backdrop_path
        ? `${IMAGE_BASE_URL}w1280${movie.backdrop_path}` // 더 큰 해상도의 백드롭 이미지
        : movie.poster_path
        ? `${IMAGE_BASE_URL}w500${movie.poster_path}` // 포스터 이미지
        : NO_IMAGE_URL;

    const handleImdbSearch = (title: string) => {
        // IMDb에서 검색하기 버튼 클릭 시 새 탭 열기
        window.open(`https://www.imdb.com/find?q=${title}`, '_blank');
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* 🎨 중앙에 카드 형태의 모달 박스 요구사항 충족 */}
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative transform transition-all scale-100 opacity-100 animate-slide-up"
                onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
            >
                {/* 모달 닫기 버튼 */}
                <button
                    className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-10 hover:bg-black transition-colors"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* 모달 상단 포스터 이미지 (예시 이미지와 유사하게) */}
                <div className="relative h-60 md:h-80 overflow-hidden bg-gray-200">
                    {modalHeaderImageUrl !== NO_IMAGE_URL ? (
                        <img
                            src={modalHeaderImageUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                            이미지 없음
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    {/* 모달에 최소 아래 이미지의 정보들을 표시 요구사항 충족 */}
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{movie.title}</h2>
                    <p className="text-lg text-gray-500 mb-4">{movie.original_title}</p> {/* 원문제목 추가 */}

                    <div className="flex items-center gap-4 text-gray-700 mb-6">
                        <span className="flex items-center text-xl font-semibold text-yellow-500">
                            ⭐️ {movie.vote_average.toFixed(1)}
                            <span className="text-sm text-gray-500 ml-1"> ({movie.vote_count} 표)</span>
                        </span>
                        <span>|</span>
                        <span className="text-lg">개봉일: {movie.release_date}</span>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">줄거리</h3>
                        <p className="text-gray-700 leading-relaxed text-base">{movie.overview || "줄거리 정보가 없습니다."}</p>
                    </div>

                    {/* IMDb 검색 버튼 */}
                    <button
                        className="mt-8 w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-lg shadow-md"
                        onClick={() => handleImdbSearch(movie.title)}
                    >
                        IMDb에서 검색하기
                    </button>
                </div>
            </div>
        </div>
    );
};