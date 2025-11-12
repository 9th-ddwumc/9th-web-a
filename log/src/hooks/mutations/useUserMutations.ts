// hooks/mutations/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { QUERY_KEY } from '../../constants/key';
import type { ResponseMyInfo } from '../../types/auth'; 

// Mutation에 전달할 데이터 인터페이스
interface UpdateProfileData {
  name: string;
  bio?: string | null; 
  avatarFile?: File | null;
  avatarUrlToRemove?: boolean; 
}

// 프로필 수정 Mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<ResponseMyInfo> => {
      const formData = new FormData();
      
      formData.append('name', data.name);
      
      if (data.bio !== undefined) {
        // bio가 null이면 빈 문자열로 전송하여 서버에서 null로 처리되도록 유도
        formData.append('bio', data.bio === null ? '' : data.bio); 
      }
      
      if (data.avatarFile) {
        formData.append('avatar', data.avatarFile);
      } else if (data.avatarUrlToRemove) {
        formData.append('avatar', ''); 
      }

      const response = await axiosInstance.patch('/v1/users/me', formData);
      
      // getMyInfo와 일관성을 위해 데이터 구조를 평탄화 (Flattening)
      if (response.data.data) {
        return {
            ...response.data,
            ...response.data.data 
        } as ResponseMyInfo;
      }
      
      return response.data as ResponseMyInfo;
    },
    
    // ✅ onMutate: 닉네임/소개 낙관적 업데이트
    onMutate: async (newProfileData) => {
        await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
        const previousMyInfo = queryClient.getQueryData([QUERY_KEY.myInfo]);

        // 닉네임과 소개 즉시 업데이트 (Nav-Bar와 MyPage에 바로 반영)
        queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => {
            if (!old) return old;
            
            return {
                ...old,
                name: newProfileData.name !== undefined ? newProfileData.name : old.name, 
                bio: newProfileData.bio !== undefined ? newProfileData.bio : old.bio,
            };
        });
        
        return { previousMyInfo };
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      alert('프로필이 성공적으로 수정되었습니다!');
      return data; 
    },
    
    // ✅ onError: 실패 시 롤백
    onError: (error: any, newProfileData, context) => {
      alert(error.response?.data?.message || '프로필 수정에 실패했습니다.');
      if (context?.previousMyInfo) {
            queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
        }
    },
  });
};