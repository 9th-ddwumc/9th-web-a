// src/layouts/HomeLayout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Navbar 컴포넌트 경로 확인
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 경로 확인
import { useState, useCallback, useEffect } from 'react';
import Modal from '../components/Modal';

const HomeLayout = () => {
    // 1. 사이드바 상태 관리
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. 사이드바 토글 함수 (Navbar에 전달)
    // useCallback을 사용하여 불필요한 리렌더링 방지
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    // 3. 사이드바 닫기 함수 (오버레이 및 main 클릭 시 사용)
    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);
    
    // 4. 모바일/데스크톱 해상도 변경 시 사이드바 닫기 처리
    useEffect(() => {
        const handleResize = () => {
            // 창 크기가 768px 이상 (데스크톱)이 되면 사이드바를 닫음
            if (window.innerWidth >= 768) {
                // 모바일에서만 열려있던 사이드바를 닫음 (데스크톱 환경에서는 항상 숨김)
                if (isSidebarOpen) {
                    setIsSidebarOpen(false);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]); // isSidebarOpen이 변경될 때만 리스너 재등록

    return (
        // flex-col: 세로 배치
        <div className="min-h-screen flex flex-col bg-[#000000]">
            
            {/* 💡 Navbar는 고정 상단에 위치 (z-index 필요) */}
            <Navbar toggleSidebar={toggleSidebar} />
            
            {/* 💡 컨텐츠와 사이드바를 위한 메인 flex 영역 */}
            <div className="relative flex flex-row flex-1"> {/* Navbar 높이만큼 상단 패딩 추가 */}
                
                {/* 💡 모바일 사이드바 오버레이 (Sidebar가 열려 있고, 768px 미만일 때) */}
                {isSidebarOpen && window.innerWidth < 768 && (
                    <div
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40" // z-40은 Sidebar(z-50)보다 낮아야 함
                    />
                )}
                
                {/* 💡 Sidebar 컴포넌트 */}
                {isSidebarOpen && (
                    <div 
                        className="fixed top-16 left-0 z-50 h-[calc(100vh-4rem)]" 
                    >
                        <Sidebar />
                    </div>
                )}
                
                {/* 💡 메인 콘텐츠 영역 (Outlet) */}
                <main
                    // 모바일에서 사이드바가 열려있을 때 main 클릭 시 사이드바를 닫습니다.
                    onClick={isSidebarOpen ? closeSidebar : undefined}
                    className={`flex-1 relative z-10 p-4 pt-0 text-white 
                        ${isSidebarOpen && window.innerWidth < 768 ? 'opacity-50' : ''}`}
                >
                    {/* HomeLayout의 자식 라우트 콘텐츠가 렌더링되는 곳 */}
                    <Outlet />
                </main>
            </div>
            <Modal />
        </div>
    );
}

export default HomeLayout;