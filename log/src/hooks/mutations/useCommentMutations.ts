// hooks/mutations/useCommentMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

interface CreateCommentData {
  lpId: string;
  content: string;
}

interface UpdateCommentData {
  lpId: string;
  commentId: number;
  content: string;
}

interface DeleteCommentData {
  lpId: string;
  commentId: number;
}

// ✅ 댓글 작성
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await axiosInstance.post(
        `/v1/lps/${data.lpId}/comments`,
        { content: data.content }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // ✅ 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['lpComments', variables.lpId] 
      });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    },
  });
};

// ✅ 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCommentData) => {
      const response = await axiosInstance.patch(
        `/v1/lps/${data.lpId}/comments/${data.commentId}`,
        { content: data.content }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // ✅ 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['lpComments', variables.lpId] 
      });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    },
  });
};

// ✅ 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteCommentData) => {
      const response = await axiosInstance.delete(
        `/v1/lps/${data.lpId}/comments/${data.commentId}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // ✅ 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['lpComments', variables.lpId] 
      });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    },
  });
};