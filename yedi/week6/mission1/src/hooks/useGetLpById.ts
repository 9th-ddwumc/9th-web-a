import { useQuery } from '@tanstack/react-query';
import { getLpById } from '../api/lps';

export const useGetLpById = (lpid: string | undefined) => {
  return useQuery({
    queryKey: ['lp', lpid],

    queryFn: () => getLpById(lpid!),

    enabled: !!lpid,

    select: (response) => response.data,
  });
};