import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLpComment } from '../api/lps';

export const useDeleteLpComment = (lpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteLpComment({ lpid, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      alert('댓글이 삭제되었습니다.');
    },
    onError: (error) => {
      alert(`댓글 삭제에 실패했습니다: ${error.message}`);
    },
  });
};