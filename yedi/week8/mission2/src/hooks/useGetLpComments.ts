// src/hooks/useGetLpComments.ts
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { getLpComments } from '../api/lps';
import type { SortOrder } from '../api/lps';
import type { CommentListResponse } from '../api/types';

export const useGetLpComments = (
  lpid: string | undefined | null,
  order: SortOrder,
  options?: Omit<
    UseInfiniteQueryOptions<
      CommentListResponse, 
      Error, 
      CommentListResponse, 
      (string | null | undefined | SortOrder)[], 
      number 
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpid, order],

    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLpComments({ lpid: lpid!, order, pageParam }),

    initialPageParam: 0, 

    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },

    enabled: !!lpid, 
    ...options, 
  });
};