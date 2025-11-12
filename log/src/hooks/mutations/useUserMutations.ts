// hooks/mutations/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

interface UpdateProfileData {
  name: string;
  bio?: string;
  avatar?: File | null;
}

// ✅ 프로필 수정 Mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (data.bio !== undefined) {
        formData.append('bio', data.bio);
      }
      
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      const response = await axiosInstance.patch('/v1/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // ✅ 사용자 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      alert('프로필이 성공적으로 수정되었습니다!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '프로필 수정에 실패했습니다.');
    },
  });
};