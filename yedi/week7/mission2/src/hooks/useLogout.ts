import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postLogout } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/apiClient';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAccessToken, setRefreshToken, setUser } = useAuth();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      // 1. AuthContext 상태 초기화
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      // 2. Axios 헤더 토큰 제거
      delete apiClient.defaults.headers.common['Authorization'];

      // 3. React Query 캐시 초기화 (중요)
      // 로그아웃 시, 이전 사용자 정보(예: 'lp', 'myInfo')가 캐시에 남아있으면 안 됨
      queryClient.clear();

      alert('로그아웃 되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout API failed:', error);
      // API 실패 시에도 프론트엔드에서는 로그아웃 처리를 강행
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      queryClient.clear();
      navigate('/');
    },
  });
};