import { useState, useCallback, useEffect } from 'react';

// useSidebar 커스텀 훅
// 사이드바의 상태 관리, 토글 함수, ESC 키 닫기, 배경 스크롤 방지 기능을 제공합니다.
export const useSidebar = () => {
    // isSidebarOpen 상태는 PC/모바일 관계없이 햄버거 메뉴 토글을 위해 사용됩니다.
    const [isOpen, setIsOpen] = useState(false);

    // 사이드바 열기
    const open = useCallback(() => setIsOpen(true), []);
    // 사이드바 닫기
    const close = useCallback(() => setIsOpen(false), []);
    // 사이드바 토글
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    /*
     * 3) 접근성 개선: ESC 키로 닫기 및 4) 사용성 개선: 배경 스크롤 방지 로직
     */
    useEffect(() => {
        const isDesktop = window.innerWidth >= 768; 

        // 4) 배경 스크롤 방지 로직: 모바일(md 미만)에서만 스크롤을 막습니다.
        // PC에서도 토글은 되지만, 스크롤 방지는 모바일의 고유 기능으로 간주
        if (isOpen && !isDesktop) {
            document.body.style.overflow = 'hidden';
        } else {
            // 닫힌 상태이거나 PC 크기일 때 스크롤 복구
            document.body.style.overflow = 'unset';
        }

        // 3) ESC 키로 닫기 로직 (keydown EventListener 활용): PC/모바일 모두 작동
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            }
        };

        // EventListener 등록
        window.addEventListener('keydown', handleKeyDown);

        // 클린업 함수: 리스너 해제 및 스크롤 복구
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, close]); // isOpen과 close 함수가 변경될 때마다 실행

    // 해상도 변경 시 사이드바 상태 처리: PC <-> 모바일 전환 시 현재 상태를 유지하지 않고 닫음
    useEffect(() => {
        let isResizing = false;
        let lastWidth = window.innerWidth;

        const handleResize = () => {
            // 리사이즈가 시작되었는지 확인
            if (!isResizing) {
                isResizing = true;
            }

            // 해상도 기준점(768px)을 넘어갈 때 상태를 닫음으로 초기화
            if ((lastWidth < 768 && window.innerWidth >= 768) || 
                (lastWidth >= 768 && window.innerWidth < 768)) {
                
                // PC <-> 모바일 전환 시 사이드바를 닫음 (깔끔한 전환)
                setIsOpen(false);
            }
            
            lastWidth = window.innerWidth;
            // 리사이즈가 끝났음을 표시
            isResizing = false;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isSidebarOpen: isOpen,
        openSidebar: open,
        closeSidebar: close,
        toggleSidebar: toggle,
    };
};