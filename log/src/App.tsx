import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/HomeLayout';
import MainPage from './pages/HomePage';
import LpDetailPage from './pages/LpDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  if (!accessToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* ✅ 구글 로그인 콜백은 레이아웃 밖에 배치 */}
      <Route path="/v1/auth/google/callback" element={<GoogleLoginRedirectPage />} />
      <Route path="/auth/google/callback" element={<GoogleLoginRedirectPage />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/lp/:lpid" element={<LpDetailPage />} />
        <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/search" element={<MainPage />} />
      </Route>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;