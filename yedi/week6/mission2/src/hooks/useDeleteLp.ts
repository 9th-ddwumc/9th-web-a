// src/hooks/useDeleteLp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteLpById } from '../api/lps';

export const useDeleteLp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpid: string) => deleteLpById(lpid),
    onSuccess: () => {
      alert('LP가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('LP 삭제 실패:', error);
      alert(`삭제에 실패했습니다: ${error.message}`);
    },
  });
};