// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import MyPage from './MyPage';
import ProtectedLayout from './components/ProtectedLayout';
import GoogleCallback from './pages/GoogleCallback';
import SharedLayout from './components/SharedLayout'; // 1. SharedLayout 임포트

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. 레이아웃이 없는 독립 페이지들 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallback />}
        />

        {/* 3. 공통 레이아웃(SharedLayout)을 사용하는 페이지들 */}
        <Route element={<SharedLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/my-page" element={<MyPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;