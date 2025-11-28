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

    const modalHeaderImageUrl = movie.backdrop_path
        ? `${IMAGE_BASE_URL}w1280${movie.backdrop_path}`
        : movie.poster_path
        ? `${IMAGE_BASE_URL}w500${movie.poster_path}`
        : NO_IMAGE_URL;

    const handleImdbSearch = (title: string) => {
        window.open(`https://www.imdb.com/find?q=${encodeURIComponent(title)}`, '_blank');
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative transform transition-all my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 닫기 버튼 - 항상 보이도록 고정 */}
                <button
                    className="sticky top-4 left-[calc(100%-3rem)] z-20 text-white text-3xl font-bold bg-black/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black transition-colors ml-auto mr-4"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* 포스터 이미지 */}
                <div className="relative h-48 md:h-64 overflow-hidden bg-gray-200 -mt-14">
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
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{movie.title}</h2>
                    <p className="text-base text-gray-500 mb-4">{movie.original_title}</p>

                    <div className="flex items-center gap-4 text-gray-700 mb-6">
                        <span className="flex items-center text-lg font-semibold text-yellow-500">
                            ⭐️ {movie.vote_average.toFixed(1)}
                            <span className="text-sm text-gray-500 ml-1"> ({movie.vote_count.toLocaleString()} 표)</span>
                        </span>
                        <span>|</span>
                        <span className="text-base">개봉일: {movie.release_date}</span>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">줄거리</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">{movie.overview || "줄거리 정보가 없습니다."}</p>
                    </div>

                    <button
                        className="mt-6 w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-base shadow-md"
                        onClick={() => handleImdbSearch(movie.title)}
                    >
                        IMDb에서 검색하기
                    </button>
                </div>
            </div>
        </div>
    );
};