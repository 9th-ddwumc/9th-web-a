// hooks/queries/useGetInfiniteLpList.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER_TYPE } from "../../enums/commmons";
import { axiosInstance } from "../../apis/axios";

interface LpListParams {
  search?: string;
  order?: PAGINATION_ORDER_TYPE;
  limit?: number;
}

interface LpItem {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes: any[];
}

interface LpListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: LpItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

const getInfiniteLpList = async ({ 
  cursor, 
  search = '', 
  order = 'desc', 
  limit = 20 
}: LpListParams & { cursor?: number }) => {
  const { data } = await axiosInstance.get<LpListResponse>("/v1/lps", {
    params: { 
      cursor, 
      search, 
      order, 
      limit 
    },
  });

  return data.data;
};

function useGetInfiniteLpList({ search = '', order = 'desc', limit = 20 }: LpListParams) {
  return useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      return await getInfiniteLpList({
        cursor: pageParam,
        search,
        order,
        limit,
      });
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext && lastPage.nextCursor 
        ? lastPage.nextCursor 
        : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteLpList;