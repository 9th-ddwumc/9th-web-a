// src/App.tsx (수정)

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter ([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    // children 배열에서 카테고리 라우트 제거
    // children:[]
  },
  {
    // ⭐️ 카테고리 라우트를 최상위 레벨로 이동 ⭐️
    path: '/movies/category/:category',
    element: <MoviePage/>,
    errorElement: <NotFoundPage/>,
  }
])

function App() {
  return <RouterProvider router = {router}/>;
}

export default App;