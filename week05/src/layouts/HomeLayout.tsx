// src/layouts/HomeLayout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Navbar 컴포넌트 경로 확인
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 경로 확인
import Modal from '../components/Modal';
import { useSidebar } from '../hooks/useSidebar';

const HomeLayout = () => {
    /// useSidebar 커스텀 훅을 사용하여 상태와 함수를 가져옵니다.
    const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar(); 

    // 현재 화면 너비가 768px 이상인지 확인하는 함수 (데스크톱 여부 판단)
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    // 사이드바를 렌더링해야 하는 조건: 모바일에서 열려 있거나, 데스크톱일 경우
    const shouldRenderSidebar = isSidebarOpen || isDesktop;

    return (
        // flex-col: 세로 배치
        <div className="min-h-screen flex flex-col bg-[#000000]">
            
            {/* 💡 Navbar는 고정 상단에 위치 (z-index 필요) */}
            <Navbar toggleSidebar={toggleSidebar} />
            
            {/* 💡 컨텐츠와 사이드바를 위한 메인 flex 영역 */}
            <div className="relative flex flex-row flex-1"> {/* Navbar 높이만큼 상단 패딩 추가 */}
                
                {/* 💡 모바일 사이드바 오버레이 (Sidebar가 열려 있고, 768px 미만일 때) */}
                {isSidebarOpen && !isDesktop && (
                    <div
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40" // z-40은 Sidebar(z-50)보다 낮아야 함
                    />
                )}
                
                {/* 💡 Sidebar 컴포넌트 Wrapper */}
                {shouldRenderSidebar && ( 
                    <div 
                        className={`
                        // PC/모바일 관계없이 항상 fixed로 처리하여 애니메이션이 부드럽게 동작하도록 설정
                        fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-60
                        
                        transition-transform duration-300 ease-in-out
                        
                        // isSidebarOpen 상태에 따라 translate-x 제어
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        
                        `}
                    >
                        <Sidebar />
                    </div>
                )}
                
                <main
                    onClick={isSidebarOpen ? closeSidebar : undefined}
                    className={`
                        flex-1 relative z-10 p-4 text-white pt-16
                        
                        // 사이드바가 열렸을 때 모바일에서만 opacity 적용
                        ${isSidebarOpen && window.innerWidth < 768 ? 'opacity-50' : ''}
                        
                        ${isSidebarOpen ? 'md:ml-60' : 'md:ml-0'} 
                        transition-all duration-300 ease-in-out
                    `}
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