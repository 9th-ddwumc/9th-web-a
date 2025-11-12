import type { PaginationDto, CommonResponse } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";
import type { ResponseLpListDto, RequestLpCreateDto, ResponseLpDetailDto } from "../types/lp.ts";

export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

// ✅ 추가: LP 생성 API
export const postLp = async (body: RequestLpCreateDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

// ✅ 추가: LP 수정 API
export const putLp = async (lpId: string, body: RequestLpCreateDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.put(`/v1/lps/${lpId}`, body);
  return data;
};

// ✅ 추가: LP 삭제 API
export const deleteLp = async (lpId: string): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

// ✅ 추가: 좋아요 API
export const postLpLike = async (lpId: string): Promise<CommonResponse> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    return data;
};

// ✅ 추가: 댓글 작성 API
export const postComment = async (lpId: string, content: string): Promise<CommonResponse> => {
  // 실제로는 이 함수 대신 LpDetailPage.tsx의 useMutation 내부에서 axiosInstance를 직접 사용했습니다.
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};

// ✅ 추가: 댓글 수정 API
export const putComment = async (lpId: string, commentId: number, content: string): Promise<CommonResponse> => {
  const { data } = await axiosInstance.put(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

// ✅ 추가: 댓글 삭제 API
export const deleteComment = async (lpId: string, commentId: number): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};