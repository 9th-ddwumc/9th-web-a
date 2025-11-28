// src/pages/MoviePage.tsx (수정)

import { useEffect } from 'react'
import { useState } from 'react';
import type { MovieResponse, Movie } from '../types/Movie';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // 환경 변수 사용

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending]=useState(false);
  const [isError, setIsError]=useState(false);
  const [page, setPage]=useState(1);

  const {category} = useParams<{
    category: string;
  }>();

  useEffect(() => {
      const fetchMovies = async () => {
      setIsPending(true);
        try{
            // URL에서 하드코딩된 api_key를 제거하고, 헤더에 환경 변수를 사용
            const {data} = await axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              // VITE_TMDB_API_KEY를 Bearer 토큰으로 사용
              Authorization: `Bearer ${TMDB_API_KEY}`
            }
          }
      );
      setMovies(data.results);
      } catch {
        setIsError(true);
      } finally{
        setIsPending(false);
      }
    };
    fetchMovies();
  }, [page, category]);

  /*if(!isPending){
    return <LoadingSpinner/>
  }*/
 if(isError){
  return <div>
    <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
  </div>
 }
  return (
    <>
    <div className='flex  items-center justify-center gap-6 mt-5'>
      <button className='bg-black text-white px-6 -py-3 rounded-lg shadow-md
      hover:bg-white transition-all duration-300 disabled:bh-gray-300
      cursor-pointer disabled:cusor-not-allowed'
       disabled={page===1}
       onClick={()=> setPage((prev)=> prev-1)}>
        {'<'}
      </button>
      <span>{page} 페이지</span>
      <button className='bg-black text-white px-6 -py-3 rounded-lg shadow-md
      hover:bg-white transition-all duration-300 cursor-pointer' 
       onClick={()=> setPage((prev)=> prev+1)}>
        {'>'}
      </button>
    </div>
    {isPending && (
      <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner/>
      </div>
    )}

    {!isPending && (
       <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
    lg:grid-cols-5 xl:grid-cols-6'>
      {movies.map((movie)=>(
        <MovieCard key={movie.id} movie={movie}/>
      ))}
    </div>
    )}
    </>
  );
}