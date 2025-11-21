// src/hooks/useGetLpById.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getLpById } from '../api/lps';
import type { Lp, LpDetailResponse } from '../api/types'; 

export const useGetLpById = (
  lpid: string | undefined | null,
  options?: Omit<
    UseQueryOptions<
      LpDetailResponse, 
      Error, 
      Lp, 
      (string | null | undefined)[] 
    >,
    'queryKey' | 'queryFn' | 'select' 
  >,
) => {
  return useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpById(lpid!),
    enabled: !!lpid, 
    select: (response) => response.data,
    ...options,
  });
};