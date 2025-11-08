// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => (
  <nav className="w-full border-b border-white/10">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex gap-10 py-3">
        {LINKS.map(({ to, label }) => (
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
    </div>
  </nav>
);
