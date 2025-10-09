// src/components/Navbar.tsx
import { NavLink, Link } from "react-router-dom";

const LINKS: { to: string; label: string }[] = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "font-bold text-white" : "text-gray-400 hover:text-white"
            }
          >
            홈
          </NavLink>

          {LINKS.slice(1).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "font-bold text-white" : "text-gray-400 hover:text-white"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-[#E52B12] px-3 py-1.5 text-sm text-white"
          >
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
