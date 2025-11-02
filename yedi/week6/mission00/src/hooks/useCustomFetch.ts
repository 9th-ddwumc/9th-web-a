import { useState, useEffect, useMemo, useRef } from 'react';

// 로컬 스토리지 캐시 구조 
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 타임스탬프
}

// 캐시 시간 (staleTime) - 5초로 짧게 설정하여 테스트 
const STALE_TIME = 5 * 1000; // 5초

// 재시도 설정 
const MAX_RETRIES = 3; // 최대 3번 재시도
const INITIAL_RETRY_DELAY = 1000; 

export function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  // 요청 취소를 위한 AbortController ref 
  const abortControllerRef = useRef<AbortController | null>(null);
  // 재시도 횟수 카운트를 위한 ref
  const retryTimeoutRef = useRef<number | null>(null);

  // URL이 변경될 때만 storageKey 재생성 (쿼리 키 역할) 
  const storageKey = useMemo(() => `customFetchCache_${url}`, [url]);

  useEffect(() => {
    // AbortController 인스턴스 생성 
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // 데이터 패치 함수
    const fetchData = async (currentRetry = 0) => {
      setIsPending(true);
      setIsError(false);

      //1. 캐시 확인 (staleTime) 
      try {
        const cachedItem = localStorage.getItem(storageKey);
        if (cachedItem) {
          const cacheEntry = JSON.parse(cachedItem) as CacheEntry<T>;
          const now = new Date().getTime();

          // 캐시가 신선한 경우 (stALE_TIME 이내)
          if (now - cacheEntry.lastFetched < STALE_TIME) {
            console.log(`[캐시 사용]: ${url}`);
            setData(cacheEntry.data);
            setIsPending(false);
            return; // 캐시된 데이터 사용, 네트워크 요청 X
          } else {
            // 캐시가 오래된 경우, 일단 캐시 데이터 보여주고 백그라운드 요청
            console.log(`[오래된 캐시 사용]: ${url}`);
            setData(cacheEntry.data);
          }
        }
      } catch (e) {
        console.warn('캐시 파싱 에러, 캐시 삭제:', e);
        localStorage.removeItem(storageKey);
      }

      // 2. 네트워크 요청 
      try {
        console.log(`[네트워크 요청]: ${url} (시도: ${currentRetry + 1})`);
        const response = await fetch(url, { signal }); // AbortController 시그널 전달 

        // 4xx, 5xx 에러 처리
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newData = (await response.json()) as T;
        setData(newData);

        //3. 새 데이터 캐싱
        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };
        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
        
        setIsPending(false);

      } catch (error: any) {
        // 4. 에러 처리 및 재시도 (Retry)

        // 요청 취소(Abort)로 인한 에러는 무시 
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }

        // 재시도 로직 
        if (currentRetry < MAX_RETRIES) {
          // 지수 백오프 (Exponential Backoff) 
          const delay = Math.pow(2, currentRetry) * INITIAL_RETRY_DELAY;
          console.log(`[재시도]: ${delay}ms 후 재시도... (${currentRetry + 1}/${MAX_RETRIES})`);

          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, delay);

        } else {
          // 최대 재시도 횟수 초과
          console.error(`[최종 실패]: ${url}`, error);
          setIsError(true);
          setIsPending(false);
        }
      }
    };

    fetchData(0);

    // 클린업 함수 (컴포넌트 unmount 또는 URL 변경 시)
    return () => {
      // 1. 진행 중인 fetch 요청 취소 (Race Condition 방지) 
      abortControllerRef.current?.abort();
      
      // 2. 예약된 재시도 타이머 취소 
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, storageKey]); // URL이 바뀔 때마다 훅 재실행

  return { data, isPending, isError };
}