import React from 'react';
import { NavLink } from 'react-router-dom';

// 각 카테고리 정보를 담은 배열
const categories = [
  { name: '인기 영화', path: '/popular' },
  { name: '상영 중', path: '/now_playing' },
  { name: '평점 높은', path: '/top_rated' },
  { name: '개봉 예정', path: '/upcoming' },
];

const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex space-x-6">
        {categories.map((category) => (
          <NavLink
            key={category.path}
            to={`/movies${category.path}`}
             // 활성화 상태에 따라 다른 글자색 적용
             className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-600 font-bold' // 활성화 시 초록색, 굵은 글씨
                  : 'text-black hover:text-green-600' // 비활성화 시 검은색, 호버 시 초록색
              }`
            }
          >
            {category.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;