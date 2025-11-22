// src/hooks/useDeleteLp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLpById } from '../api/lps';

export const useDeleteLp = (onSuccessCallback?: () => void) => { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpid: string) => deleteLpById(lpid),
    onSuccess: () => {
      alert('LP가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      if (onSuccessCallback) { 
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error('LP 삭제 실패:', error);
      alert(`삭제에 실패했습니다: ${error.message}`);
    },
  });
};