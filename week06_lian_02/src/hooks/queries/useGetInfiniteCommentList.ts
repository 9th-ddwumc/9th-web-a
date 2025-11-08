import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common"
import type { CommentsResponse } from "../../types/lpComment";
import { axiosInstance } from "../../apis/axios";

function useGetInfiniteCommentList(
  lpId: number,
  limit: number,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosInstance.get<{
        status: boolean;
        message: string;
        statusCode: number;
        data: CommentsResponse;
      }>(`/v1/lps/${lpId}/comments`, {
        params: { cursor: pageParam, limit, order },
      });

      console.log("API response:", response.data.data);
      return response.data.data;
    },
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    initialPageParam: 0,
  });
}


export default useGetInfiniteCommentList;