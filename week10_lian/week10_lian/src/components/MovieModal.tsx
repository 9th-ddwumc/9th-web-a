import { useEffect } from "react";
import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
  onClose: () => void;
};

function formatKoreanDate(iso: string) {
  if (!iso) return "정보 없음";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export default function MovieModal({ movie, onClose }: Props) {
  // ESC로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const score = movie.voteAverage ? movie.voteAverage.toFixed(1) : "0.0";

  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={onClose} // 바깥 클릭 닫기
      role="dialog"
      aria-modal="true"
    >
      {/* 모달 박스 (바깥 클릭 방지: 내부는 전파 막기) */}
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 상단 배너 */}
        <div className="relative h-56 bg-slate-200 md:h-64">
          {movie.backdropUrl ? (
            <img
              src={movie.backdropUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" />
          )}

          {/* 어두운 그라데이션(텍스트 가독성) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          {/* 닫기 X 버튼 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label="닫기"
            type="button"
          >
            ✕
          </button>

          {/* 제목 영역 */}
          <div className="absolute bottom-5 left-6 right-6">
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">
              {movie.title}
            </h2>
            <p className="mt-1 text-sm text-white/80">{movie.originalTitle}</p>
          </div>
        </div>

        {/* 본문 */}
        <div className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
          {/* 포스터 */}
          <div className="-mt-16 md:-mt-20">
            <div className="overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-black/10">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center text-slate-500">
                  No Image
                </div>
              )}
            </div>

            {/* 버튼들 */}
            <div className="mt-4 flex gap-3">
              <a
                href={imdbUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600"
              >
                IMDb에서 검색
              </a>

              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                type="button"
              >
                닫기
              </button>
            </div>
          </div>

          {/* 정보 */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-extrabold text-blue-600">
                {score}
              </span>
              <span className="text-sm text-slate-500">
                ({movie.voteCount.toLocaleString()} 평가)
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-800">개봉일</h3>
                <p className="mt-1 text-slate-700">
                  {formatKoreanDate(movie.releaseDate)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">인기도</h3>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                  {/* popularity는 범위가 커서 “감각적인 바”로만 표시(0~100 기준 clamp) */}
                  <div
                    className="h-2 rounded-full bg-slate-800"
                    style={{
                      width: `${Math.min(100, Math.max(0, movie.popularity))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">줄거리</h3>
                <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                  {movie.overview || "줄거리 정보가 없어요."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
