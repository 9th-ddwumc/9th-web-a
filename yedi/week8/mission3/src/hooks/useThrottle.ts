import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T & { cancel: () => void } {
  // 마지막 실행 시간을 저장 (렌더링을 유발하지 않음)
  const lastExecuted = useRef(0);
  // 타이머 ID를 저장하여 마지막 호출을 지연
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null); 

  const throttledFunc = useCallback(
    function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const now = Date.now();
      
      // 마지막 실행 후 경과 시간
      const timeSinceLast = now - lastExecuted.current;
      // 남은 시간
      const remainingTime = delay - timeSinceLast;

      // delay가 지났거나 (remainingTime <= 0), 
      // 아직 한 번도 실행되지 않은 경우
      if (remainingTime <= 0) {
        // 이전 타이머가 있다면 정리
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null;
        }
        
        // 즉시 실행 (Leading Edge) 및 마지막 실행 시간 갱신
        lastExecuted.current = now;
        func.apply(this, args);
        return;
      }
      
      // delay가 아직 지나지 않았고, 타이머가 설정되지 않은 경우 
      //    -> 마지막 요청을 delay 시점에 실행하기 위해 타이머를 설정
      if (!timerId.current) {
        timerId.current = setTimeout(() => {
          // 타이머 만료 후 실행
          lastExecuted.current = Date.now();
          timerId.current = null;
          func.apply(this, args);
        }, remainingTime); // 남은 시간만큼만 대기
      }
    },
    [func, delay],
  ) as T;
  
  // Throttle 상태를 취소(초기화)하는 함수
  const cancel = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    lastExecuted.current = 0; 
    timerId.current = null;
  }, []);
  
  // 반환된 함수에 cancel 함수를 추가
  (throttledFunc as T & { cancel: () => void }).cancel = cancel;

  return throttledFunc as T & { cancel: () => void };
}