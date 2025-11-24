// src/hooks/useThrottle.ts
import { useRef, useCallback } from 'react';

/**
 * useThrottle Hook (함수 실행 제어용)
 * 이벤트를 일정 주기(delay)마다 한 번만 실행되도록 제한합니다.
 * * @param callback 실행할 함수
 * @param delay 제한할 시간 간격 (ms)
 * @returns 스로틀링이 적용된 함수
 */
function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number) {
    const lastRun = useRef(0);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        
        if (now - lastRun.current >= delay) {
            callback(...args);
            lastRun.current = now;
        }
    }, [callback, delay]);
}

export default useThrottle;