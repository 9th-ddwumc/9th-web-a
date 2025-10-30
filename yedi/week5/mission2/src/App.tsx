import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import MyPage from './MyPage'; 
import ProtectedLayout from './components/ProtectedLayout'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === 공개 라우트 === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* === 보호된 라우트 (Protected Route) === */}
        {/* Protected Route를 활용해 경로 보호
          /my-page로 접근 시, ProtectedLayout이 먼저 렌더링됨
        */}
        <Route element={<ProtectedLayout />}>
          <Route path="/my-page" element={<MyPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;