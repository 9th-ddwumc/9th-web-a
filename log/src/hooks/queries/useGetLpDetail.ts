import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface LpDetail {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags?: Array<{
    id: number;
    name: string;
  }>;
  likes?: Array<{
    id: number;
    userId: number;
    lpId: number;
  }>;
}

const getLpDetail = async (lpId: string): Promise<LpDetail> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data.data || data;
};

function useGetLpDetail(lpId: string | undefined) {
  return useQuery({
    queryKey: ['lp', lpId], // ✅ lpid를 포함한 쿼리 키
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export default useGetLpDetail;