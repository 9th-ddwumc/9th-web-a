import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type {
  CreateLpDto,
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpDto,
  ResponseLpListDto,
  UpdateLpDto,
} from "../types/lp";

export const getLPList = async (
  PaginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  //구조분해할당
  const { data } = await axiosInstance.get("/v1/lps", {
    params: PaginationDto,
  });

  return data;
};

export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const createLp = async (lp: CreateLpDto) => {
  const { data } = await axiosInstance.post("/v1/lps", lp);
  return data;
};

export const patchLp = async ({ lpId, ...rest }: UpdateLpDto) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, rest);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};