// src/pages/MoviePage.tsx

import { useEffect, useState, useCallback } from 'react';
import type { MovieResponse, Movie } from '../types/Movie';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Navbar } from '../components/Navbar'; // ⭐️ Navbar 추가 ⭐️

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
        );
        setMovies(data.results);
      } catch (error) { // ⭐️ 에러 객체 받도록 수정
        console.error('API Error:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchMovies();
  }, [page, category]);

  const handleMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (isError) {
    return (
      <div>
        <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    // ⭐️ 전체 컨테이너 추가 ⭐️
    <div className="p-4 bg-gray-50 min-h-screen"> 
      <Navbar/> 
      <div className="max-w-7xl mx-auto mt-4"> {/* 내부 컨텐츠 컨테이너 */}
        
        <div className='flex items-center justify-center gap-6 mt-5'>
          <button
            className='bg-black text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed'
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {'<'}
          </button>
          <span>{page} 페이지</span>
          <button
            className='bg-black text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-gray-800 transition-all duration-300 cursor-pointer'
            onClick={() => setPage((prev) => prev + 1)}
          >
            {'>'}
          </button>
        </div>

        {isPending && (
          <div className='flex items-center justify-center h-dvh'>
            <LoadingSpinner />
          </div>
        )}

        {!isPending && (
          <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 xl:grid-cols-6'>
            {movies.map((movie) => (
              <div key={movie.id} onClick={() => handleMovieSelect(movie)}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 모달: 카드 클릭 시 표시, IMDb로 이동 가능 */}
      <Modal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}