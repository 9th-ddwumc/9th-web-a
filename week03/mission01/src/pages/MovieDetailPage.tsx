// src/pages/MovieDetailPage.tsx

import { useParams } from 'react-router-dom';

export default function MovieDetailPage() {
  // URL에서 영화 ID 추출
  const { movieId } = useParams<{ movieId: string }>(); 
  
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">영화 상세 정보</h1>
      <p className="text-xl text-gray-600">
        현재 보고 있는 영화 ID: <span className="font-semibold text-blue-600">{movieId}</span>
      </p>
      
      <div className="mt-8 p-6 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="font-medium text-yellow-800">
          **[미션 구현 필요]** 이 페이지에서 `movieId`를 이용해 TMDB 상세 API를 호출하고 상세 정보를 렌더링해야 합니다.
        </p>
      </div>
    </div>
  );
}