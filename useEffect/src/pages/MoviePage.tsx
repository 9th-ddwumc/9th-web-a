import { useEffect } from 'react'
import { useState } from 'react';
import type { MovieResponse, Movie } from '../types/Movie';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

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
      const {data} = await axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/${category}?api_key=0a1275a832b57a2a9fafe501b098a4ca&language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
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
      <button className='bg-black text-white px-6 py-3 rounded-lg shadow-md
      hover:bg-white transition-all duration-300 disabled:bg-gray-300
      cursor-pointer disabled:cursor-not-allowed'
       disabled={page===1}
       onClick={()=> setPage((prev)=> prev-1)}>
        {'<'}
      </button>
      <span>{page} 페이지</span>
      <button className='bg-black text-white px-6 py-3 rounded-lg shadow-md
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