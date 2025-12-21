import { useQuery } from '@tanstack/react-query';
// import { useEffect, useMemo, useState } from "react";

// const STALE_TIME = 5 * 60 * 1000;


// // 로컬 스토리지에 저장할 데이터의 구조
// interface CacheEntry<T> {
//   data: T;
//   lastFetched: number;
// }

// export const useCustomFetch = <T>(url: string): {data: any, isPending: boolean, isError: boolean} => {

//     const [data, setData] = useState<T | null>(null);
//     const [isPending, setIsPending] = useState<boolean>(false);
//     const [isError, setIsError] = useState<boolean>(false);

//     const storageKey = useMemo((): string => url, [url]);

//   // 컴포넌트가 다 렌더링되고 실행될 때
//     useEffect((): void => {
//         setIsError(false);
        
//         // fetch('https://jsonPlaceholder.typicode.com/users/1');
//         const fetchData = async() : Promise<void> => {
//             const currentTime = new Date().getTime();
//             const cachedItem = localStorage.getItem(storageKey);

//             // 캐시 데이터 확인, 신선도 검증
//             if (cachedItem) {
//                 try {
//                     const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

//                     // 캐시가 신선한 경우
//                     if (currentTime - cachedData.lastFetched < STALE_TIME) {
//                         setData(cachedData.data);
//                         setIsPending(false);
//                         console.log('캐시된 데이터 사용', url);

//                         return;
//                     }

//                     // 캐시가 만료된 경우
//                     setData(cachedData.data);
//                     console.log('만료된 캐시 데이터 사용', url);
//                 } catch {
//                     localStorage.removeItem(storageKey);
//                     console.warn('캐시 에러: 캐시 삭제됨', url);
//                 }
//             }

//             setIsPending(true);
//             try {
//                 const response = await fetch(url);

//                 if (!response.ok) {
//                     throw new Error('failed to data');
//                 }

//                 const newData = await response.json() as T;
//                 setData(newData);

//                 const newCacheEntry: CacheEntry<T> = {
//                     data: newData,
//                     lastFetched: new Date().getTime(),
//                 };

//                 localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
//             } catch (error) {
//                 setIsError(true);
//                 console.log(error);
//             } finally {
//                 setIsPending(false);
//             }
//         }
//         fetchData();
        
//     }, [url, storageKey]);

//     return {data, isPending, isError};
// };

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    // 쿼리 키: 데이터를 식별하고 캐싱하는 고유 키
    // url이 같으면 같은 캐시를 공유하고, url이 다르면 별도로 관리
    queryKey: [url],

    // 쿼리 함수: 실제로 데이터를 가져오는 비동기 함수
    // React Query가 자동으로 signal을 제공하여 요청 취소 지원
    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
      }

      return response.json() as Promise<T>;
    },

    // 재시도 설정: 실패 시 최대 3회 자동 재시도
    retry: 3,

    // 재시도 지연 시간: 지수 백오프 전략
    // 0회차: 1초, 1회차: 2초, 2회차: 4초 (최대 30초 제한)
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 30000),

    // 데이터 신선도 관리: 5분 동안은 네트워크 요청 없이 캐시 사용
    staleTime: 5 * 60 * 1000,

    // 가비지 컬렉션: 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거
    gcTime: 10 * 60 * 1000,
  });
};