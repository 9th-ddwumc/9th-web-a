// // src/pages/MoviePage.tsx (App.tsx나 다른 페이지에 삽입 가능)
// import { useState, useEffect } from 'react';
// import axios, { type AxiosResponse } from 'axios'; // AxiosResponse 임포트
// import MovieCard from '../components/MovieCard';
// import type { Movie, MovieResponse } from '../types/Movie';

// export default function MoviePage() {
//   // 영화 목록 상태 (Movie 타입 배열)
//   const [movies, setMovies] = useState<Movie[]>([]); 
  
//   // TMDB API 기본 설정
//   const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
  
//   // 환경 변수에서 토큰을 안전하게 불러옵니다.
//   const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY; 

//   // 데이터 패칭 함수 (useEffect 내에서 호출하기 위해 비동기로 정의)
//   const fetchMovies = async () => {
//     try {
//       // Axios 요청: 응답 데이터의 타입을 MovieResponse로 명시 (타입 세이프티 확보)
//       const response: AxiosResponse<MovieResponse> = await axios.get(
//         TMDB_API_URL,
//         {
//           params: {
//             language: 'ko-KR', // 한국어로 데이터를 요청
//           },
//           headers: {
//             // 헤더에 인증 정보 포함
//             Authorization: `Bearer ${TMDB_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       // 응답 데이터 (axios는 .data 안에 실질적인 응답이 담겨 있음)
//       setMovies(response.data.results);
      
//     } catch (error) {
//       console.error('영화 데이터를 불러오는 중 오류 발생:', error);
//       // 로딩 상태나 에러 상태 처리 로직 추가 가능
//     }
//   };

//   // 컴포넌트 마운트 시 한 번만 데이터 패칭 실행
//   useEffect(() => {
//     fetchMovies();
//   }, []); // 의존성 배열이 비어있으므로 최초 1회만 실행

//   return (
//     <div className="p-10"> {/* 상위 패딩 추가 */}
//       <h1 className="text-3xl font-bold mb-8 text-center">TMDB 인기 영화</h1>
      
//       {/* 데이터가 로드된 경우에만 렌더링 */}
//       {movies.length > 0 ? (
//         <div 
//           className="grid gap-6 
//                      grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
//         >
//           {movies.map((movie) => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">영화를 불러오는 중입니다...</p>
//       )}
//     </div>
//   );
// }
// src/pages/MoviePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios, { type AxiosResponse } from 'axios';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/Movie';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MoviePage() {
  // URL 파라미터에서 카테고리 추출
  const { category } = useParams<{ category: string }>(); 
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 1. 상태 관리
  const [movies, setMovies] = useState<Movie[]>([]); 
  const [page, setPage] = useState(1); // 페이지네이션 상태
  const [isPending, setIsPending] = useState(false); // 로딩 상태
  const [isError, setIsError] = useState(false); // 에러 상태

  // 2. 환경 변수 및 API 설정
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY; 
  // 카테고리 값을 URL에 동적으로 사용
  const TMDB_API_URL = `https://api.themoviedb.org/3/movie/${category || 'popular'}`;

  // 3. 데이터 패칭 함수
  const fetchMovies = async () => {
    // [00:09:06] 요청 시작 시 로딩 시작, 에러 초기화
    setIsPending(true);
    setIsError(false);

    try {
      const response: AxiosResponse<MovieResponse> = await axios.get(
        TMDB_API_URL,
        {
          params: {
            language: 'ko-KR',
            page: page, // 페이지 값 전달
          },
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setMovies(response.data.results);
      
    } catch (error) {
      console.error('영화 데이터를 불러오는 중 오류 발생:', error);
      setIsError(true); // 실패 시 에러 상태 true
      
    } finally {
      setIsPending(false); // 요청 완료 시 로딩 종료
    }
  };

  // 4. useEffect: 카테고리나 페이지가 바뀔 때마다 실행
  // 디펜던시 배열에 category와 page 추가
  useEffect(() => {
    // 카테고리 변경 시 페이지를 1로 초기화 (선택 사항)
    setPage(1); 
    if (category) {
      fetchMovies();
    }
  }, [category]); 
  
  // 페이지 변경 시 fetchMovies 호출
  useEffect(() => {
    fetchMovies();
  }, [page]); 

  // 5. 에러 분기 처리
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl font-semibold">에러가 발생했습니다. (데이터 요청 실패)</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8 text-center capitalize">
        {category?.replace('_', ' ') || '인기'} 영화
      </h1>
      
      {/* 로딩 스피너 조건부 렌더링 */}
      {isPending && <LoadingSpinner />} 

      {/* 로딩 상태가 아닐 때만 컨텐츠 표시 */}
      {!isPending && (
        <>
          {/* 영화 목록 */}
          {movies.length > 0 ? (
            <div 
              className="grid gap-6 
                         grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  // 카드 클릭 시 상세 페이지로 이동
                  onClick={() => navigate(`/movie/${movie.id}`)} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              데이터가 없습니다.
            </p>
          )}

          {/* 페이지네이션 버튼 */}
          {movies.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1} // 1페이지일 때는 비활성화
                className={`px-6 py-3 rounded-lg shadow-md transition-colors duration-200 
                          text-white font-medium 
                          ${page === 1 
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                          }`}
              >
                &larr; 이전
              </button>

              <span className="text-xl font-bold text-gray-700">
                {page} 페이지
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-3 rounded-lg shadow-md transition-colors duration-200 
                           bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                다음 &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}