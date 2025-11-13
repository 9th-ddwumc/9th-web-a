import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLpComment } from '../api/lps';

export const useCreateLpComment = (lpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createLpComment({ lpid, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
    },
    onError: (error) => {
      console.error('댓글 생성 실패:', error);
      alert(`댓글 작성에 실패했습니다: ${error.message}`);
    },
  });
};