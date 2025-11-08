import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createLp } from '../api/lps';

export const useCreateLp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createLp,
    onSuccess: (data) => {
      alert('LP가 성공적으로 생성되었습니다.');

      queryClient.invalidateQueries({ queryKey: ['lps'] });

      const newLpId = data.data.id;
      navigate(`/lp/${newLpId}`);
    },
    onError: (error) => {
      console.error('LP 생성 실패:', error);
      alert(`생성에 실패했습니다: ${error.message}`);
    },
  });
};