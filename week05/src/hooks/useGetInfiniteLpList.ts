import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../enums/common";
import { QUERY_KEY } from "../constants/key";
import { getLPList } from "../api/lp";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: async ({ pageParam = 0 }) => {
      // fetchNextPage() 호출 시 로딩을 느리게 보여주기 위한 의도적 지연
      await new Promise((res) => setTimeout(res, 800));

      const response = await getLPList({
        cursor: pageParam,
        limit,
        search,
        order,
      });

      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log("✅ lastPage:", lastPage);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;