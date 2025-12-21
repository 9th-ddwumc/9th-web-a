/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { AxiosRequestConfig } from 'axios';

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(url, options);
        setData(response.data);
      } catch (err) {
        setError("에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // options가 객체이므로 참조값이 바뀌면 재실행됨 (useMemo 필요)

  return { data, isLoading, error };
};

export default useFetch;