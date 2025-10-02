// // src/pages/MovieDetailPage.tsx

// import { useParams } from 'react-router-dom';

// export default function MovieDetailPage() {
//   // URL에서 영화 ID 추출
//   const { movieId } = useParams<{ movieId: string }>(); 

//   // TMDB API 토큰 (환경 변수 사용)
//   const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY;
//   // 카테고리 값을 URL에 동적으로 사용
//   const TMDB_API_URL = `https://api.themoviedb.org/3/movie/${category || 'popular'}`;

  
//   return (
//     <div className="p-10 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">영화 상세 정보</h1>
//       <p className="text-xl text-gray-600">
//         현재 보고 있는 영화 ID: <span className="font-semibold text-blue-600">{movieId}</span>
//       </p>
      
//       <div className="mt-8 p-6 bg-yellow-100 border border-yellow-300 rounded-lg">
//         <p className="font-medium text-yellow-800">
//           **[미션 구현 필요]** 이 페이지에서 `movieId`를 이용해 TMDB 상세 API를 호출하고 상세 정보를 렌더링해야 합니다.
//         </p>
//       </div>
//     </div>
//   );
// }
// src/pages/MovieDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner'; 
import axios from 'axios';
import type { CreditsResponse, MovieDetail } from '../types/Movie';

// 이미지 기본 URL
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/';

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  
  // --- 2. 상태 정의 ---
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // 토큰 정의
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY;
  
  // --- 3. 데이터 패칭 함수 (상세 정보 + 크레딧 동시 요청) ---
  const fetchMovieDetailsAndCredits = async () => {
    if (!movieId) {
      setIsError(true);
      return;
    }
    
    setIsPending(true);
    setIsError(false);

    try {
      const TMDB_DETAIL_URL = `https://api.themoviedb.org/3/movie/${movieId}`;
      const TMDB_CREDITS_URL = `https://api.themoviedb.org/3/movie/${movieId}/credits`;

      // Promise.all로 두 API 요청을 동시에 보냄
      const [detailResponse, creditsResponse] = await Promise.all([
        axios.get<MovieDetail>(TMDB_DETAIL_URL, {
          params: { language: 'ko-KR' },
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
        axios.get<CreditsResponse>(TMDB_CREDITS_URL, {
          params: { language: 'ko-KR' },
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        }),
      ]);
      
      setMovie(detailResponse.data);
      setCredits(creditsResponse.data);
      
    } catch (error) {
      console.error('영화 상세 및 크레딧 정보를 불러오는 중 오류 발생:', error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };
  
  // --- 4. useEffect: movieId 변경 시 데이터 패칭 ---
  useEffect(() => {
    fetchMovieDetailsAndCredits();
  }, [movieId]);

  // --- 5. 렌더링 분기 처리 (로딩 및 에러) ---
  if (isPending) {
    return <LoadingSpinner />;
  }
  
  if (isError || !movie) {
    return (
      <div className="p-10 text-center min-h-screen pt-40">
        <h1 className="text-3xl font-bold text-red-600 mb-4">데이터를 찾을 수 없습니다 😢</h1>
        <p className="text-gray-600">요청하신 영화 ID({movieId})에 해당하는 정보가 없거나, API 호출에 실패했습니다.</p>
      </div>
    );
  }

  // 데이터 가공
  const director = credits?.crew.find(c => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 10) || [];
  const backdropUrl = movie.backdrop_path ? `${BASE_IMAGE_URL}original${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${BASE_IMAGE_URL}w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  // --- 6. 상세 페이지 UI (Tailwind CSS 디자인) ---
  return (
    <div className="relative pb-16">
      
      {/* 배경 이미지 배너 */}
      {backdropUrl && (
        <div className="absolute inset-x-0 top-0 h-[400px] overflow-hidden">
          <img
            src={backdropUrl}
            alt={`${movie.title} 배경`}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto p-8 pt-16 md:pt-40">
        
        {/* 영화 상세 정보 섹션 */}
        <div className="flex flex-col md:flex-row gap-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          
          {/* 포스터 */}
          <div className="md:w-1/4 flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          {/* 정보 텍스트 */}
          <div className="md:w-3/4">
            <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                ⭐ 평점: {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-500">
                개봉일: {movie.release_date}
              </span>
              <span className="text-gray-500">
                상영 시간: {movie.runtime ? `${movie.runtime}분` : '정보 없음'}
              </span>
            </div>
            
            <p className="text-gray-800 text-xl font-semibold mb-4">줄거리</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-gray-300 pl-4">
              {movie.overview || '제공되는 줄거리 정보가 없습니다.'}
            </p>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span key={genre.id} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* 감독 정보 */}
            {director && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-lg font-bold text-gray-800">감독: {director.name}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* --- 출연진 섹션 --- */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2 text-gray-800">주요 출연진</h2>
          
          {topCast.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {topCast.map(actor => (
                <div key={actor.id} className="text-center bg-white p-3 rounded-lg shadow hover:shadow-lg transition">
                  <img
                    src={actor.profile_path ? `${BASE_IMAGE_URL}w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo'}
                    alt={actor.name}
                    className="w-full h-auto object-cover rounded-md mb-2"
                  />
                  <p className="font-semibold text-gray-800 line-clamp-1">{actor.name}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">({actor.character})</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">출연진 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}