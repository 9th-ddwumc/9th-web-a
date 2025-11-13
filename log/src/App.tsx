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
// New Imports
import CreateLpPage from './pages/CreateLpPage'; // ✅ 추가
import LpDetailPage from './pages/LpDetailPage'; // ✅ 추가
import EditLpPage from './pages/EditLpPage'; // ✅ 추가

function App() {
  return (
    // ✅ Routes/Route 구성으로 변경
    <Routes>
        <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="v1/auth/google/callback" element={<GoogleLoginRedirectPage />} />
            <Route path="lp/:lpid" element={<LpDetailPage />} /> {/* ✅ LP 상세 페이지 */}
            
            {/* 로그인 필수 페이지 (ProtectedLayout) */}
            <Route element={<ProtectedLayout />}>
                <Route path="my" element={<MyPage />} />
                <Route path="create" element={<CreateLpPage />} /> {/* ✅ LP 생성 */}
                <Route path="lp/:lpid/edit" element={<EditLpPage />} /> {/* ✅ LP 수정 */}
            </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App