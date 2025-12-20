import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
  onClick: (movie: Movie) => void;
};

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export default function MovieCard({ movie, onClick }: Props) {
  const score = movie.voteAverage ? movie.voteAverage.toFixed(1) : "0.0";

  return (
    <button
      type="button"
      onClick={() => onClick(movie)}
      className="group block overflow-hidden rounded-2xl bg-white text-left shadow-lg ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
    >
      <div className="relative aspect-[3/4] bg-slate-200">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            No Image
          </div>
        )}

        <div className="absolute right-3 top-3 rounded-lg bg-blue-500 px-2 py-1 text-xs font-semibold text-white shadow">
          {score}
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">
          {movie.title}
        </h3>

        {movie.releaseDate && (
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(movie.releaseDate)}
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
          {movie.overview || "줄거리가 없어요."}
        </p>
      </div>
    </button>
  );
}
