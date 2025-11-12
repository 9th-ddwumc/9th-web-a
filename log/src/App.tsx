import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomeLayout from './layouts/HomeLayout'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [ 
      {index: true, element: <HomePage/>},
      {path: 'Login', element: <LoginPage/>},
      {path: 'Signup', element: <SignupPage/>},
      {path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage/>}
    ]
  }
]

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage/>,
    children: [
      { path: '/my', element: <MyPage/> }
    ]
  }
]

const router = createBrowserRouter( [...publicRoutes, ...protectedRoutes]);
function App() {
  return (
    <Routes>
      {/* Routes/Route 구성만 유지 */}
    </Routes>
  );
}

export default App