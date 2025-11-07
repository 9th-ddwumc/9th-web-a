import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLPList = async (
  PaginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  //구조분해할당
  const { data } = await axiosInstance.get("/v1/lps", {
    params: PaginationDto,
  });

  return data;
};