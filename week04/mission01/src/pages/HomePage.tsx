// src/pages/HomePage.tsx

import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar /> {/* [00:36:04] 네비게이션 바는 모든 자식 페이지에 공통으로 표시 */}
      
      {/* 여기에 자식 라우트의 컴포넌트가 렌더링됩니다. */}
      <div className="max-w-7xl mx-auto">
        <Outlet /> 
      </div>
    </div>
  );
}