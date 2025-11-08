// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import MyPage from './MyPage';
import ProtectedLayout from './components/ProtectedLayout';
import GoogleCallback from './pages/GoogleCallback';
import LpDetail from './pages/LpDetail';
import LpCreate from './pages/LpCreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallback />}
        />
        <Route path="/lp/:lpid" element={<LpDetail />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/new-lp" element={<LpCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;