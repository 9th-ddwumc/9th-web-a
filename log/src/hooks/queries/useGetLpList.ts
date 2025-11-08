import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: ['QUERY_KEY.lps',search,cursor,order,limit],
    queryFn: () => 
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      //enabled: Boolean(search)
      //refetchInterval: 100 * 60, ->10초마다 업데이크
      //retry: 3
      //initialData: 
      //keepPreviousData: true,

      select: (data) => data.data.data,
  });
}
export default useGetLpList;