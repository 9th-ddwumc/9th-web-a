// src/hooks/useUpdateLp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLp } from '../api/lps';
import type { LpUpdateForm } from '../api/types';

export const useUpdateLp = (
  lpid: string,
  onSuccessCallback?: () => void, 
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpData: LpUpdateForm) => updateLp({ lpid, lpData }),
    onSuccess: (data) => {
      alert('LP가 성공적으로 수정되었습니다.');

      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });

      if (onSuccessCallback) { 
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error('LP 수정 실패:', error);
      alert(`수정에 실패했습니다: ${error.message}`);
    },
  });
};