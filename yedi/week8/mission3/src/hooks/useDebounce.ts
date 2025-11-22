// 9th-ddwumc/9th-web-a/9th-web-a-week7_yedi_02/yedi/week7/mission2/src/hooks/useDebounce.ts
// 파일 생성

import { useState, useEffect } from 'react';

/**
 * 주어진 값(value)의 변경을 지정된 지연 시간(delay) 동안 늦춥니다.
 *
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (ms)
 * @returns 지연된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수: value나 delay가 변경되면 이전 타이머를 취소합니다.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}