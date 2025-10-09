import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage' // HomePage는 HomePage 파일에서
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomeLayout from './layouts/HomeLayout' // 예시 경로
import LoginPage from './pages/LoginPage'

const router = createBrowserRouter( [
  {
    path: '/',
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [ 
      {index: true, element: <HomePage/>},
      {path: 'Login', element: <LoginPage/>},
      {path: 'Signup', element: <SignupPage/>},
    ]
  },
])
function App() {

  return (
    <>
     <RouterProvider router={router}/>;
    </>
  )
}

export default App
 