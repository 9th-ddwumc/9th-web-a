import { useQuery } from "@tanstack/react-query"
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
// import type { ResponseLpListDto } from "../../types/lp";

// const initialLpListData: ResponseLpListDto = {
//   status: true,
//   statusCode: 200,
//   message: "",
//   data: {
//     data: []
//   },
//   nextCursor: 0,
//   hasNext: false,
// }

function useGetLpList({ cursor, search, order, limit}: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () => getLpList({ cursor, search, order, limit }),
    staleTime: 1000 * 60 * 5,
    gcTime: 100 * 60 * 10,
    // enabled: Boolean(search),
    // refetchInterval: 100 * 60,
    // initialData: initialLpListData,
    // keepPreviousData: true,

    select: (data) => data.data.data,
  });
}

export default useGetLpList;