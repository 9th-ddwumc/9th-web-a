// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/Mypage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 처음 들어오면 /login 으로 보냄 (임시) */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 공개 영역 */}
        <Route path="/" element={<HomeLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          {/* 필요시 홈을 쓰려면 아래 주석 해제
          <Route index element={<HomePage />} />
          */}
        </Route>

        {/* 보호 영역 */}
        <Route path="/my" element={<ProtectedLayout />}>
          <Route index element={<MyPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
