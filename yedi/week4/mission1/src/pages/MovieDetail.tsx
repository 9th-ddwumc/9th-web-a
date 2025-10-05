import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch'; // Custom Hook 불러오기

// 영화 상세 정보 타입
interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
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
  const { movieId } = useParams<{ movieId: string }>();

  // useCustomFetch 훅을 사용 -> 영화 상세 정보, 크레딧 정보 각각 불러옴
  const { data: details, loading: detailsLoading, error: detailsError } = useCustomFetch<MovieDetails>(`/movie/${movieId}`);
  const { data: credits, loading: creditsLoading, error: creditsError } = useCustomFetch<Credits>(`/movie/${movieId}/credits`);

  // 로딩 스피너 표시
  if (detailsLoading || creditsLoading) return <LoadingSpinner />;
  // 에러 메시지 표시
  if (detailsError || creditsError) return <div className="text-red-500 text-center text-2xl">데이터를 불러오는 데 실패했습니다.</div>;
  // 데이터 없음 메시지 표시
  if (!details || !credits) return <div>데이터가 없습니다.</div>;

  const director = credits.crew.find(member => member.job === 'Director');
  const posterUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;

   return (
    <div className="min-h-screen">
      {/* 배경 이미지 섹션 */}
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <img src={backdropUrl} alt={details.title} className="w-full h-full object-cover object-top" />
      </div>

      {/* 영화 정보 섹션 */}
      <div className="container mx-auto px-4 sm:px-8 py-16 flex flex-col md:flex-row gap-8">
        {/* 포스터 이미지 */}
        <img
          src={posterUrl}
          alt={details.title}
          className="w-full md:w-1/3 lg:w-1/4 h-auto object-contain rounded-lg shadow-2xl self-center md:self-start border-4 border-gray-700/60"
        />
        <div className="md:w-2/3 lg:w-3/4 flex flex-col space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{details.title}</h1>
          
          <div className="flex items-center space-x-4 text-gray-400">
            <span>{new Date(details.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{details.runtime}분</span>
          </div>

          {/* 장르 및 평점 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
              <span>⭐</span>
              <span>{details.vote_average.toFixed(1)}</span>
            </div>
            {details.genres?.map(genre => (
              <span key={genre.id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                {genre.name}
              </span>
            ))}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">줄거리</h2>
            <p className="leading-relaxed text-gray-300">{details.overview}</p>
          </div>

          {director && (
            <div className="pt-4 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-white">감독</h3>
              <p className="text-gray-300">{director.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* 출연진 섹션: 카드 디자인으로 변경 */}
      <div className="container mx-auto px-4 sm:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-white">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {credits.cast.slice(0, 12).map((member) => (
            <div key={member.id} className="text-center bg-gray-800 rounded-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-xl">
              <img
                src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://via.placeholder.com/200x300'}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-600"
              />
              <p className="font-bold text-white">{member.name}</p>
              <p className="text-sm text-gray-400">{member.character} 역</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;