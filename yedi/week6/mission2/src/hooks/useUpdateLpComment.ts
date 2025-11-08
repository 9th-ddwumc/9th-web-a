import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLpComment } from '../api/lps';

export const useUpdateLpComment = (lpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { commentId: number; content: string }) =>
      updateLpComment({ lpid, ...variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
    },
    onError: (error) => {
      alert(`댓글 수정에 실패했습니다: ${error.message}`);
    },
  });
};