import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail'; // MovieDetail 컴포넌트 불러오기

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 기본 경로 접속 시 /movies/popular 로 자동 이동 */}
          <Route index element={<Navigate to="/movies/popular" replace />} />
          {/* 동적 경로 설정 */}
          <Route path="movies/:category" element={<MovieList />} />
            {/* 영화 상세 페이지를 위한 동적 라우트 추가 */}
          <Route path="movie/:movieId" element={<MovieDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;