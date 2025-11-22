// src/hooks/useUnlikeLp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLikeLp } from '../api/lps';
import type { Lp, User, LpDetailResponse } from '../api/types';
import { useAuth } from '../contexts/AuthContext';

interface UnlikeContext {
  previousResponse: LpDetailResponse;
}

export const useUnlikeLp = (lpid: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<unknown, Error, void, UnlikeContext | undefined>({
    mutationFn: () => deleteLikeLp(lpid),

    onMutate: async () => {
      if (!user) return undefined;

      const queryKey = ['lp', lpid];
      await queryClient.cancelQueries({ queryKey });

      const previousResponse =
        queryClient.getQueryData<LpDetailResponse>(queryKey);

      if (!previousResponse || !previousResponse.data) return undefined;

      const previousLp = previousResponse.data;

      // 3. UI 즉시 업데이트 (낙관적 데이터 생성)
      const optimisticLp: Lp = {
        ...previousLp,
        likes: previousLp.likes.filter((like) => like.userId !== user.id),
      };

      const optimisticResponse: LpDetailResponse = {
        ...previousResponse,
        data: optimisticLp,
      };
      queryClient.setQueryData(queryKey, optimisticResponse);

      return { previousResponse };
    },

    onError: (err, variables, context) => {
      console.error('좋아요 취소 실패:', err);
      if (context?.previousResponse) {
        queryClient.setQueryData(['lp', lpid], context.previousResponse);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpid] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
};