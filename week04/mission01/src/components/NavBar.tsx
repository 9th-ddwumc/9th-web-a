// src/components/NavBar.tsx

import { NavLink } from 'react-router-dom';

// 카테고리 링크 목록
const CATEGORY_LINKS = [
  { to: '/', label: '홈' },
  { to: '/movies/popular', label: '인기 영화' },
  { to: '/movies/now_playing', label: '상영 중' },
  { to: '/movies/top_rated', label: '평점 높은' },
  { to: '/movies/upcoming', label: '개봉 예정' },
];

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="flex gap-4 p-4 items-center justify-start max-w-7xl mx-auto">
        {CATEGORY_LINKS.map(({ to, label }) => (
          // NavLink를 사용하여 활성화된 링크에 동적 스타일 적용
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-colors duration-200 
              ${isActive
                ? 'bg-blue-600 text-white font-bold' // 활성화(Active) 상태 스타일
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100' // 비활성 상태 스타일
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}