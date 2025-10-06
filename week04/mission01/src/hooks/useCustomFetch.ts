// src/hooks/useCustomFetch.ts

import { useState, useEffect } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// 훅이 반환할 상태들의 타입 정의
interface FetchState<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
  error: unknown; // 에러 객체 자체를 포함
}

// 요청 파라미터 타입 정의 (AxiosRequestConfig에서 url과 params만 사용)
interface FetchParams {
  url: string;
  config?: AxiosRequestConfig; // Axios 요청 구성 옵션 전체를 받을 수 있도록 확장
  // 의존성 배열에 포함될 추가적인 값 (예: category, page)
  dependencies?: unknown[]; 
}

// 커스텀 훅 정의
// T는 성공 시 응답 데이터의 타입입니다.
export function useCustomFetch<T>({ url, config, dependencies = [] }: FetchParams): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // 환경 변수에서 TMDB_TOKEN을 불러옵니다.
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    // URL이 없거나 토큰이 없으면 요청하지 않음
    if (!url || !TMDB_TOKEN) {
      setData(null);
      setIsError(false);
      return;
    }

    const abortController = new AbortController();
    
    // 비동기 데이터 패칭 함수
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      setError(null);
      setData(null); // 데이터 초기화

      try {
        const response: AxiosResponse<T> = await axios.get(
          url,
          {
            ...config, // 외부에서 전달받은 config 옵션 (params 등)
            signal: abortController.signal, // 요청 중단 시그널
            headers: {
              ...config?.headers, // 기존 헤더 유지
              Authorization: `Bearer ${TMDB_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        setData(response.data);
      } catch (err) {
        // 요청 중단(Abort)이 아닌 경우에만 에러 처리
        if (!axios.isCancel(err) && (err as any).name !== 'AbortError') {
          console.error('API 호출 중 오류 발생:', err);
          setIsError(true);
          setError(err);
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    // 컴포넌트 언마운트 또는 의존성 변경 시 요청 중단 (cleanup)
    return () => {
      abortController.abort();
    };
  }, [url, TMDB_TOKEN, ...dependencies]);

  return { data, isPending, isError, error };
}