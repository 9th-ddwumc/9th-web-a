import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpsList, type SortOrder } from '../api/lps';

// search 파라미터 추가
export const useGetLps = (sort: SortOrder, search: string) => {
  
  const trimmedSearch = search.trim();
  
  const queryKey = ['lps', sort, trimmedSearch]; 

  return useInfiniteQuery({
    queryKey: queryKey, 
    
    queryFn: ({ pageParam }) => getLpsList({ 
      order: sort, 
      search: trimmedSearch || undefined, // 빈 문자열이면 undefined 전달 
      pageParam 
    }), 
    
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