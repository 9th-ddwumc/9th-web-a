import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import MyPage from './MyPage'; 
import ProtectedLayout from './components/ProtectedLayout';
import GoogleCallback from './pages/GoogleCallback'; // 💡 1. GoogleCallback 임포트

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === 공개 라우트 === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 💡 2. 구글 로그인 콜백 전용 라우트 추가 */}
        {/* Swagger에 명시된 백엔드의 콜백 주소와 일치해야 함 [cite: image_122664.png] */}
        <Route 
          path="/v1/auth/google/callback" 
          element={<GoogleCallback />} 
        />

        {/* === 보호된 라우트 (Protected Route) === */}
        <Route element={<ProtectedLayout />}>
          <Route path="/my-page" element={<MyPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
