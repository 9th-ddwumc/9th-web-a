// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import MyPage from './MyPage';
import ProtectedLayout from './components/ProtectedLayout';
import GoogleCallback from './pages/GoogleCallback';

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

        <Route element={<ProtectedLayout />}>
          <Route path="/my-page" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;