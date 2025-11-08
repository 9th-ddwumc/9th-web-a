import { useQuery } from '@tanstack/react-query';
import { getLpsList, type SortOrder } from '../api/lps';

export const useGetLps = (sort: SortOrder) => {
  return useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLpsList({ order: sort }),

    select: (response) => response.data.data,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};