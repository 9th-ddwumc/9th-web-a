// src/hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUser } from '../api/auth';
import type { UserUpdateForm, User, UserDetailResponse } from '../api/types';
import { useAuth } from '../contexts/AuthContext';

interface UserUpdateContext {
  previousUser: User | null;
  previousMyInfoResponse: UserDetailResponse | undefined;
}

export const useUpdateUser = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UserUpdateForm, UserUpdateContext | undefined>({
    mutationFn: (userData: UserUpdateForm) => patchUser(userData),

    onMutate: async (newUserData) => {
      // 1. AuthContext의 현재 유저 정보(UI가 의존하는)를 즉시 업데이트
      const previousUser = user;
      setUser((currentUser) => {
        if (!currentUser) return null;
        return {
          ...currentUser,
          ...newUserData,
        };
      });

      //  'myInfo' 쿼리 캐시 업데이트
      const queryKey = ['myInfo'];
      await queryClient.cancelQueries({ queryKey });

      const previousMyInfoResponse =
        queryClient.getQueryData<UserDetailResponse>(queryKey);

      if (previousMyInfoResponse) {
        queryClient.setQueryData<UserDetailResponse>(queryKey, {
          ...previousMyInfoResponse,
          data: {
            ...previousMyInfoResponse.data,
            ...newUserData,
          },
        });
      }

      //  롤백을 위해 이전 유저 정보 반환
      return { previousUser, previousMyInfoResponse };
    },

    onError: (err, newUserData, context) => {
      //  AuthContext 롤백
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      //  'myInfo' 쿼리 캐시 롤백
      if (context?.previousMyInfoResponse) {
        queryClient.setQueryData(['myInfo'], context.previousMyInfoResponse);
      }

      console.error('프로필 수정 실패:', err);
      alert(`수정에 실패했습니다: ${err.message}`);
    },

    onSuccess: (data: any) => {
      const updatedUser = data.data;

      //  AuthContext를 서버 최종 데이터로 동기화
      setUser(updatedUser);
      // 'myInfo' 쿼리 캐시도 서버 최종 데이터로 동기화
      queryClient.setQueryData(['myInfo'], data);

      alert('프로필이 성공적으로 수정되었습니다.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });
};