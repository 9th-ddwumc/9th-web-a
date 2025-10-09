import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export function useCustomFetch<T>(url: string): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, isPending, isError };
}