/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import { BrowserRouter, createBrowserRouter, Navigate, Route, RouterProvider, Routes, type RouteObject } from 'react-router-dom'
import SignupPage from './pages/SignupPage.tsx'
import HomeLayout from './layouts/HomeLayout.tsx' // 예시 경로
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import ProtectedLayout from './layouts/ProtectedLayout'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import HomePage from './pages/HomePage.tsx'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpDetailPage from './pages/LpDetailPage.tsx'

// App.tsx 수정 제안

const allRoutes: RouteObject[] = [
  {
    // 최상위 경로를 HomeLayout으로 설정 (Navbar/Sidebar 포함)
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 1. 공용 라우트
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },

      // 2. 보호된 라우트 (ProtectedLayout을 Wrapper로 사용)
      {
        element: <ProtectedLayout />, // 이 요소가 인증 체크를 수행
        children: [
          {
            path: "mypage", // /mypage로 접근
            element: <MyPage />,
          },
          {
            path: "lp/:id",
            element: <LpDetailPage />,
          },
        ],
      },
    ],
  },
  // 매칭되는 경로가 없을 때 404를 처리하는 최종 경로
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(allRoutes);

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 3,
//     },
//   },
// });

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;