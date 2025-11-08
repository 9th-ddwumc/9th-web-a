import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { axiosInstance } from "../../apis/axios";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(limit: number, search: string, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosInstance.get("/v1/lps", {
        params: {
          cursor: pageParam,
          limit,
          search: search || undefined,
          order,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined,
    initialPageParam: 0,
  });
}

export default useGetInfiniteLpList;