import { apiClient } from './apiClient';
import type {
  LpListResponse,
  LpDetailResponse,
  LpCreateForm, 
  LpCreateResponse, 
} from './types';

export type SortOrder = 'asc' | 'desc';

interface GetLpsParams {
  order: SortOrder;
  search?: string;
}

export const getLpsList = async ({ order }: GetLpsParams) => {
  const response = await apiClient.get<LpListResponse>('/v1/lps', {
    params: {
      order,
    },
  });
  return response.data;
};

export const getLpById = async (lpid: string) => {
  const response = await apiClient.get<LpDetailResponse>(`/v1/lps/${lpid}`);
  return response.data;
};

export const deleteLpById = async (lpid: string) => {
  const response = await apiClient.delete(`/v1/lps/${lpid}`);
  return response.data;
};


export const createLp = async (
  lpData: LpCreateForm,
): Promise<LpCreateResponse> => {
  const response = await apiClient.post<LpCreateResponse>('/v1/lps', lpData);
  return response.data;
};