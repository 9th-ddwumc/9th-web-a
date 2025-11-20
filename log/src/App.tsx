// src/App.tsx
import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomeLayout from './layouts/HomeLayout'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import {ProtectedLayout} from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'
import CreateLpPage from './pages/CreateLpPage';
import LpDetailPage from './pages/LpDetailPage';
import EditLpPage from './pages/EditLpPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="search" element={<SearchPage />} /> {/* ✅ 검색 페이지 */}
            <Route path="v1/auth/google/callback" element={<GoogleLoginRedirectPage />} />
            <Route path="lp/:lpid" element={<LpDetailPage />} />
            
            {/* 로그인 필수 페이지 (ProtectedLayout) */}
            <Route element={<ProtectedLayout />}>
                <Route path="my" element={<MyPage />} />
                <Route path="create" element={<CreateLpPage />} />
                <Route path="lp/:lpid/edit" element={<EditLpPage />} />
            </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App