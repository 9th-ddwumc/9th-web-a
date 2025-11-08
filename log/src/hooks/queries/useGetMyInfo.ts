// hooks/queries/useGetMyInfo.ts
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";  // ✅ apis/auth에서 import
import type { ResponseMyInfo } from "../../types/auth";

function useGetMyInfo(enabled: boolean = true) {
  return useQuery<ResponseMyInfo>({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    enabled, // 로그인 상태일 때만 실행
    staleTime: 1000 * 60 * 10, // 10분 (사용자 정보는 자주 변하지 않음)
    gcTime: 1000 * 60 * 30, // 30분
    retry: 1,
  });
}

export default useGetMyInfo;