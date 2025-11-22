import { useState, useEffect, useCallback } from 'react';

export const useSidebar = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  // 상태 관리 함수
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  
  // ESC 키 닫기 
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 클린업 함수를 통해 EventListener 해제
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  // 배경 스크롤 방지 
  useEffect(() => {
    if (isOpen) {
      // 사이드바가 열렸을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 사이드바가 닫혔을 때 body 스크롤 복원
      document.body.style.overflow = '';
    }
    
    // 컴포넌트 언마운트 시 body 스크롤 복원
    return () => {
        document.body.style.overflow = '';
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
};