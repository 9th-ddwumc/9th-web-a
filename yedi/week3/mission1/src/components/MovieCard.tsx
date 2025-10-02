import React from 'react';

// MovieCard 컴포넌트가 받을 props의 타입을 정의
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    // group 클래스를 추가 -> 하위 요소에서 group-hover를 사용할 수 있게 함
    <div className="relative group rounded-lg overflow-hidden shadow-lg">
      <img 
        src={imageUrl} 
        alt={movie.title} 
        className="w-full h-auto transition-transform duration-300 ease-in-out transform group-hover:blur-sm group-hover:scale-105"
      />
      {/* 마우스를 올렸을 때 나타날 정보 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <h3 className="text-lg font-bold text-center">{movie.title}</h3>
        <p className="mt-2 text-sm text-center line-clamp-4">
          {movie.overview}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;