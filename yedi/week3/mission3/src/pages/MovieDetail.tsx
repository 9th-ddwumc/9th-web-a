import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

// 영화 상세 정보 타입
interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
}

// 출연진(Credits) 정보 타입
interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

// 제작진 정보 타입
interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

const MovieDetail = () => {
  // URL의 :movieId 파라미터 값을 가져옴
  const { movieId } = useParams<{ movieId: string }>();

  // 데이터를 저장할 state 생성
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        // 두 개의 API를 동시에 요청
        const detailPromise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: { api_key: apiKey, language: 'ko-KR' },
        });
        const creditsPromise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          params: { api_key: apiKey, language: 'ko-KR' },
        });

        // Promise.all -> 모든 요청이 완료될 때까지 기다림
        const [detailResponse, creditsResponse] = await Promise.all([detailPromise, creditsPromise]);

        setDetails(detailResponse.data);
        setCredits(creditsResponse.data);

      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center text-2xl">{error}</div>;
  if (!details || !credits) return <div>데이터가 없습니다.</div>;

  // 감독 정보 찾기
  const director = credits.crew.find(member => member.job === 'Director');
  const posterUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;

  return (
    <div className="text-white">
      {/* 1. 배경 이미지 섹션 */}
      <div className="relative w-full h-[50vh]">
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        <img src={backdropUrl} alt={details.title} className="w-full h-full object-cover" />
      </div>

      {/* 2. 영화 정보 섹션 */}
      <div className="container mx-auto p-8 flex flex-col md:flex-row -mt-32 relative z-20">
        <img src={posterUrl} alt={details.title} className="w-64 h-96 rounded-lg shadow-2xl" />
        <div className="md:ml-8 mt-8 md:mt-0">
          <h1 className="text-4xl font-bold">{details.title} ({new Date(details.release_date).getFullYear()})</h1>
          <div className="flex items-center space-x-4 mt-2 text-gray-300">
            <span>{details.release_date}</span>
            <span>•</span>
            <span>{details.runtime}분</span>
          </div>
          <p className="text-yellow-400 font-bold text-lg mt-4">평점: ★ {details.vote_average.toFixed(1)}</p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">줄거리</h2>
          <p className="leading-relaxed">{details.overview}</p>
          {director && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">감독</h3>
              <p>{director.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. 출연진 섹션 */}
      <div className="container mx-auto px-8 py-4">
        <h2 className="text-3xl font-bold mt-8 mb-6">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {credits.cast.slice(0, 12).map((member) => (
            <div key={member.id} className="text-center">
              <img
                src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://via.placeholder.com/200x300'}
                alt={member.name}
                className="w-full h-auto rounded-full object-cover shadow-lg mx-auto max-w-[150px]"
              />
              <p className="mt-2 font-bold">{member.name}</p>
              <p className="text-sm text-gray-400">{member.character} 역</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;