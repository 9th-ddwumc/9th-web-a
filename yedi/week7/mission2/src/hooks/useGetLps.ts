import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpsList, type SortOrder } from '../api/lps';

export const useGetLps = (sort: SortOrder) => {
  return useInfiniteQuery({
    queryKey: ['lps', sort], 
    queryFn: ({ pageParam }) => getLpsList({ order: sort, pageParam }), 
    
    initialPageParam: 0, 

    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) {
        return lastPage.data.nextCursor;
      }
      return undefined; 
    },
    
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};