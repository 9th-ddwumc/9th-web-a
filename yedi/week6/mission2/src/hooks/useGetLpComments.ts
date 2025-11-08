import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpComments } from '../api/lps';
import type { SortOrder } from '../api/lps';

export const useGetLpComments = (
  lpid: string | undefined,
  order: SortOrder,
) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpid, order], //
    queryFn: ({ pageParam }) =>
      getLpComments({ lpid: lpid!, order, pageParam }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    enabled: !!lpid, 
  });
};