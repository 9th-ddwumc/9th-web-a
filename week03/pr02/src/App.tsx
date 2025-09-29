// import './App.css'

// // 1. React Router에서 필요한 함수/컴포넌트를 import
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// // 2. 경로(path)와 보여줄 화면(element)를 정의
// // const router = createBrowserRouter([
// //   {
// //     path: '/',
// //     element: <h1>홈 페이지입니다.</h1>,
// //     errorElement: <h1>없는 경로다~</h1>
// //   },
// //   {
// //     path: '/movies',
// //     element: <h1>영화 페이지 입니다.</h1>
// //   }
// // ]);

// const NotFound = () => (
//   <main style={{ padding: 24 }}>
//     <h1>페이지를 찾을 수 없어요 (404)</h1>
//     <p>주소를 다시 확인하거나 홈으로 이동해 주세요.</p>
//     <a href="/">홈으로</a>
//   </main>
// );

// const router = createBrowserRouter([
//   { path: '/', element: <h1>홈 페이지입니다.</h1> },
//   { path: '/movies', element: <h1>영화 페이지 입니다.</h1> },
//   { path: '*', element: <NotFound /> }, // 가장 마지막에 배치
// ]);

// // 3. RouterProvider로 router 전달
// function App() {
//   return <RouterProvider router={router} />
// }

// export default App;

import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1) 만든 페이지 import
import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Movies from './pages/movies';
import RootLayout from './layout/root-layout';

// 2) 라우터에 연결
const router = createBrowserRouter([
  {
    path: '/',
    // element: <HomePage />,
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        // 2) index: true → 부모의 기본 경로('/')일 때 렌더
        index: true,
        element: <HomePage />,
      },
      {
        // 3) 부모가 '/'이므로, 'movies'만 써도 '/movies'로 매칭
        path: 'movies',
        element: <Movies />,
      },
    ],
  },
  {
    path: '/movies',
    element: <Movies />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;