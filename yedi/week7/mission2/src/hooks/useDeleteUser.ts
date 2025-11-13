// src/hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/apiClient';

export const useDeleteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAccessToken, setRefreshToken, setUser } = useAuth();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // 로그아웃 로직과 동일하게 상태 및 캐시 초기화
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      queryClient.clear();

      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      console.error('회원 탈퇴 실패:', error);
      alert(`회원 탈퇴 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};