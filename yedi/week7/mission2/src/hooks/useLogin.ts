import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postLogin, type LoginForm, type AuthResponse } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../api/types';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setUser } = useAuth();

  return useMutation<AuthResponse, Error, { loginData: LoginForm; from: string }>({
    mutationFn: ({ loginData }) => postLogin(loginData),
    onSuccess: (data, variables) => {
      const { accessToken, refreshToken, id, name } = data;

      // 토큰 및 유저 정보 저장
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser({
        id,
        name,
        // (로그인 응답에 없는 정보는 임시값 또는 null로 채움)
        email: '',
        bio: null,
        avatar: null,
        createdAt: '',
        updatedAt: '',
      });

      alert('로그인 성공!');
      navigate(variables.from, { replace: true });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    },
  });
};