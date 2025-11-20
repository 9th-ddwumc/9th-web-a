// src/apis/lp.ts
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

export const postLp = async (body: RequestLpCreateDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const putLp = async (lpId: string, body: RequestLpCreateDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.put(`/v1/lps/${lpId}`, body);
  return data;
};

export const deleteLp = async (lpId: string): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

// ✅ 좋아요 API - POST로 토글 처리 (등록)
export const postLpLike = async (lpId: string): Promise<CommonResponse> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    return data;
};

// ✅ 좋아요 취소 API 추가 (DELETE)
export const deleteLpLike = async (lpId: string): Promise<CommonResponse> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    return data;
};

export const postComment = async (lpId: string, content: string): Promise<CommonResponse> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};

export const putComment = async (lpId: string, commentId: number, content: string): Promise<CommonResponse> => {
  const { data } = await axiosInstance.put(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

export const deleteComment = async (lpId: string, commentId: number): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};