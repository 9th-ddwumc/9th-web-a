import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "홈" },
  { to: "/movies/popular", label: "인기 영화" },
  { to: "/movies/now_playing", label: "상영 중" },
  { to: "/movies/top_rated", label: "평점 높은" },
  { to: "/movies/upcoming", label: "개봉 예정" },
];

export const Navbar = () => {
  return (
    <nav className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* justify-center → justify-start 로 변경 */}
        <ul className="flex flex-row flex-nowrap gap-x-12 items-center justify-start whitespace-nowrap">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 font-bold"
                    : "text-gray-500 hover:text-green-600"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
