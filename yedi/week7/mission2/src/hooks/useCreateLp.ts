// src/hooks/useCreateLp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../api/lps';


 // @param onSuccessCallback - (Optional) 뮤테이션 성공 시 실행할 콜백 (예: 모달 닫기)

export const useCreateLp = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      alert('LP가 성공적으로 생성되었습니다.');

      // 메인 LP 목록 캐시 무효화 
      queryClient.invalidateQueries({ queryKey: ['lps'] });

      // 콜백이 있으면 실행 (모달 닫기)
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      console.error('LP 생성 실패:', error);
      alert(`생성에 실패했습니다: ${error.message}`);
    },
  });
};