// src/hooks/mutations/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../apis/axios';
import type { RequestSigninDto } from '../../types/auth';

// 로그인 Mutation
export const useLoginMutation = (redirectPath: string = '/') => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: RequestSigninDto) => {
      await login(data);
      // ✅ localStorage와 state 동기화를 위해 충분한 대기 시간
      await new Promise(resolve => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      // ✅ replace: true로 뒤로가기 방지
      navigate(redirectPath, { replace: true });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
                     error.message || 
                     '로그인에 실패했습니다.';
      throw new Error(message);
    },
  });
};

// 로그아웃 Mutation
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    },
  });
};

// 회원 탈퇴 Mutation
export const useDeleteAccountMutation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete('/v1/users/me');
      return response.data;
    },
    onSuccess: async () => {
      await logout();
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    },
  });
};