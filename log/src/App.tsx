import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import HomePage from './pages/HomePage' // HomePage는 HomePage 파일에서
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomeLayout from './layouts/HomeLayout' // 예시 경로
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'

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
    <AuthProvider>
     <RouterProvider router={router}/>;
    </AuthProvider>
  )
}

export default App
 