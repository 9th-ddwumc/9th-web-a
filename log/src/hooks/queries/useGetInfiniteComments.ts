// hooks/queries/useGetInfiniteComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface CommentListParams {
  lpId: string;
  order?: 'asc' | 'desc';
  limit?: number;
}

interface CommentAuthor {
  id: number;
  name: string;
  avatar?: string;
}

interface CommentItem {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: CommentAuthor;
}

interface CommentListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: CommentItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

const getInfiniteComments = async ({ 
  lpId,
  cursor, 
  order = 'desc', 
  limit = 10 
}: CommentListParams & { cursor?: number }) => {
  const { data } = await axiosInstance.get<CommentListResponse>(
    `/v1/lps/${lpId}/comments`, 
    {
      params: { 
        cursor, 
        order, 
        limit 
      },
    }
  );

  return data.data;
};

function useGetInfiniteComments(
  lpId: string | undefined, 
  order: 'asc' | 'desc' = 'desc'
) {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      return await getInfiniteComments({
        lpId: lpId!,
        cursor: pageParam,
        order,
        limit: 10,
      });
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext && lastPage.nextCursor 
        ? lastPage.nextCursor 
        : undefined;
    },
    enabled: !!lpId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteComments;