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
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/lp/:lpid" element={<LpDetailPage />} />
        <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/search" element={<MainPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/google/callback" element={<GoogleLoginRedirectPage />} />
    </Routes>
  );
}

export default App;