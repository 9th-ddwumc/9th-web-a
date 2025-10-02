import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';

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
    <div className="bg-white text-gray-900 min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 기본 경로 접속 시 /movies/popular 로 자동 이동 */}
          <Route index element={<Navigate to="/movies/popular" replace />} />
          {/* 동적 경로 설정 */}
          <Route path="movies/:category" element={<MovieList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;