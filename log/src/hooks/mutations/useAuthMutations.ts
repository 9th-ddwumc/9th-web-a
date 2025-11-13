// src/hooks/mutations/useAuthMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteUser } from '../../apis/auth';
import type { RequestSigninDto } from '../../types/auth';

// 로그인 Mutation
export const useLoginMutation = (redirectPath: string = '/') => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: RequestSigninDto) => {
      await login(data);
    },
    onSuccess: () => {
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

// ✅ 회원 탈퇴 Mutation - DELETE /v1/users
export const useDeleteAccountMutation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await deleteUser();
    },
    onSuccess: async () => {
      // 모든 쿼리 캐시 삭제
      queryClient.clear();
      
      // 로그아웃 처리
      await logout();
      
      // 알림 및 리다이렉트
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      console.error('Delete account error:', error);
      const message = error.response?.data?.message || '회원 탈퇴에 실패했습니다.';
      alert(message);
    },
  });
};