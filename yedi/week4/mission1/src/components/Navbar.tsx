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
    // Navbar 스타일 수정
    <nav className="bg-gray-900 p-4 sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto flex space-x-6">
        {categories.map((category) => (
          <NavLink
            key={category.path}
            to={`/movies${category.path}`}
             // NavLink 텍스트 색상 수정
             className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-400 font-bold'
                  : 'text-gray-300 hover:text-green-400'
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