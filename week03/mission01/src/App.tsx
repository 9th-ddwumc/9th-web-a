import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoviePage from './pages/MoviePage'
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />, // [00:27:48] 네비게이션 바와 아웃렛을 포함한 레이아웃
    errorElement: <NotFoundPage />, // [00:29:10] 없는 경로 접근 시 에러 처리
    children: [
      {
        path: 'movies/:category', // [00:31:28] 카테고리를 동적으로 받는 경로 (e.g., /movies/popular)
        element: <MoviePage />,
      },
      {
        path: 'movie/:movieId', // [00:49:36] 영화 ID를 동적으로 받는 상세 페이지 경로
        element: <MovieDetailPage />,
      },
      // 다른 기본 경로 설정이 필요하다면 여기에 추가
    ],
  },
]);

function App() {
  console.log(import.meta.env.VITE_TMDB_KEY)
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
