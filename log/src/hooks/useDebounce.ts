// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * Useful for search inputs to avoid excessive API calls
 * * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 값이 변경되어 새로운 타이머를 설정하기 직전 로그
    console.log('⏳ 입력 중... debounce 타이머 설정');

    // Set up the timeout
    const handler = setTimeout(() => {
      console.log('✅ 디바운스 실행됨: 검색 API 호출 또는 이동');
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      console.log('❌ 이전 debounce 타이머 취소됨 (clearTimeout)');
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;