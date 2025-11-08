import type { PaginationDto } from "../types/common";
import axiosInstance from "axios";
import type { ResponseLpListDto } from "../types/lp";

export const getLpList = async (
  PaginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get('/v1/lps', {
    params: PaginationDto
  });

  return data;
};
