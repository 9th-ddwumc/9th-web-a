
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';

const router = createBrowserRouter([
    {
        children: [
            // 1. Public Routes (인증 없이 접근 가능)
            { path: "/", element: <HomePage /> },
            { path: "login", element: <LoginPage /> },

            // 2. Protected Routes (인증이 필요한 라우트) - ProtectedLayout 적용 [00:46:08]
            {
                element: <ProtectedLayout />, // 이 엘리먼트가 토큰을 체크함
                children: [
                    { path: "my", element: <MyPage /> }
                ],
            },
        ],
    },
]);

function App() {
  return (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
