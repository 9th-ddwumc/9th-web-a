import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage.tsx'
import HomeLayout from './layouts/HomeLayout.tsx' // 예시 경로
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

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
 