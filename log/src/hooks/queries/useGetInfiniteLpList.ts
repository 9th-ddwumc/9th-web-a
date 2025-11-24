// src/hooks/queries/useGetInfiniteLpList.ts
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
  console.log('🔍 API 요청:', { cursor, search, order, limit, timestamp: new Date().toISOString() });
  
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
  // ✅ 검색어가 공백만 있는 경우를 체크
  const trimmedSearch = search.trim();
  
  return useInfiniteQuery({
    // ✅ queryKey에 trimmed search 사용
    queryKey: ['lps', order, trimmedSearch],
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      return await getInfiniteLpList({
        cursor: pageParam,
        search: trimmedSearch,
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
    // ✅ 빈 검색어일 때도 항상 실행 (전체 목록 조회)
    // 검색어가 있을 때는 debounce된 값이 들어오므로 자동으로 지연됨
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    // 네트워크 에러 시 재시도
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export default useGetInfiniteLpList;