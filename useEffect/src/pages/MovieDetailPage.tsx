import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsPending(true);
      try {
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=0a1275a832b57a2a9fafe501b098a4ca&language=ko-KR`
        );
        setMovie(data);
      } catch (error) {
        console.error('영화 정보 로딩 실패:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500 text-2xl">
          영화 정보를 불러오는데 실패했습니다.
        </span>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 배경 이미지 */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* 영화 정보 */}
      <div className="max-w-7xl mx-auto px-6 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 포스터 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 h-96 object-cover rounded-xl shadow-2xl"
          />

          {/* 상세 정보 */}
          <div className="flex-1 text-gray-800">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="text-xl text-gray-600 mb-4">
                {movie.original_title}
              </p>
            )}

            {movie.tagline && (
              <p className="text-lg italic text-gray-500 mb-6">
                "{movie.tagline}"
              </p>
            )}

            {/* 평점 및 기본 정보 */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-xl font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-500">({movie.vote_count.toLocaleString()}표)</span>
              </div>
              <span className="text-gray-600">
                {movie.release_date}
              </span>
              <span className="text-gray-600">{movie.runtime}분</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {movie.status}
              </span>
            </div>

            {/* 장르 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 줄거리 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">줄거리</h2>
              <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
            </div>

            {/* 제작 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {movie.budget > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">제작비</h3>
                  <p className="text-gray-700">{formatCurrency(movie.budget)}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">수익</h3>
                  <p className="text-gray-700">{formatCurrency(movie.revenue)}</p>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">제작 국가</h3>
                <p className="text-gray-700">
                  {movie.production_countries.map(c => c.name).join(', ')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">언어</h3>
                <p className="text-gray-700">
                  {movie.spoken_languages.map(l => l.english_name).join(', ')}
                </p>
              </div>
            </div>

            {/* 제작사 */}
            {movie.production_companies.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">제작사</h3>
                <div className="flex flex-wrap gap-6">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="flex flex-col items-center">
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="h-12 object-contain mb-2"
                        />
                      ) : (
                        <div className="h-12 flex items-center mb-2">
                          <span className="text-gray-600 font-medium">
                            {company.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;