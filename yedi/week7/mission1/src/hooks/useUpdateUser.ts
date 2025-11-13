// src/hooks/useUpdateUser.ts
import { useMutation } from '@tanstack/react-query';
import { patchUser } from '../api/auth';
import type { UserUpdateForm } from '../api/types';
import { useAuth } from '../contexts/AuthContext'; 

export const useUpdateUser = () => {
  const { setUser } = useAuth(); 

  return useMutation({
    mutationFn: (userData: UserUpdateForm) => patchUser(userData),
    onSuccess: (data) => {
      // API 응답(data.data)에 전체 User 객체가 담겨있음
      const updatedUser = data.data;

      // AuthContext의 user 상태를 API 응답값으로 덮어쓰기
      setUser(updatedUser);

      alert('프로필이 성공적으로 수정되었습니다.');
    },
    onError: (error) => {
      console.error('프로필 수정 실패:', error);
      alert(`수정에 실패했습니다: ${error.message}`);
    },
  });
};