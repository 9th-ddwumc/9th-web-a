// src/hooks/mutations/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putUserMe } from '../../apis/auth';
import { QUERY_KEY } from '../../constants/key';
import type { ResponseMyInfo, RequestUserUpdateDto } from '../../types/auth';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RequestUserUpdateDto) => {
      console.log('Updating profile with data:', data);
      const response = await putUserMe(data);
      console.log('Update response:', response);
      return response;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousUserInfo = queryClient.getQueryData<ResponseMyInfo>([QUERY_KEY.myInfo]);

      if (previousUserInfo) {
        queryClient.setQueryData<ResponseMyInfo>([QUERY_KEY.myInfo], {
          ...previousUserInfo,
          name: newData.name || previousUserInfo.name,
          bio: newData.bio !== undefined ? newData.bio : previousUserInfo.bio,
          avatar: newData.avatar !== undefined ? newData.avatar : previousUserInfo.avatar,
        });
      }

      return { previousUserInfo };
    },
    onSuccess: (data) => {
      // ✅ 서버 응답 구조 확인
      const userData = data.data || data;
      queryClient.setQueryData([QUERY_KEY.myInfo], userData);
      alert('프로필이 성공적으로 수정되었습니다!');
    },
    onError: (error: any, _newData, context) => {
      console.error('Update profile error:', error);
      if (context?.previousUserInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousUserInfo);
      }
      const message = error.response?.data?.message || '프로필 수정에 실패했습니다.';
      alert(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};